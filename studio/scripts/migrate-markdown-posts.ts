import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import {getCliClient} from 'sanity/cli'

// One-off migration: converts the markdown posts from the old my-blog repo
// into Portable Text `post` documents. Images are intentionally skipped —
// the referenced /assets/img files don't exist anywhere in that repo.
const POSTS_DIR = process.env.POSTS_DIR ?? '/data/dev/labs/my-blog/posts'
const LANGUAGE = process.env.POST_LANGUAGE ?? 'pt'
const DRY_RUN = process.env.DRY_RUN === '1'

// filename -> translationKey of the matching pt post, so the en pass links up.
const TRANSLATION_KEYS: Record<string, string> = {
  'desestruturacao-de-objetos-e-arrays-em-js.md': 'f7u7ndvonu',
  'ferramentas-que-uso-para-trabalhar.md': 'vhedcacjgs',
  'meu-primeiro-post.md': '87gfdfcw4k',
  'otimizando-imagens-com-nodejs.md': 'cw96vwcsoq',
  'salvando-alteracoes-locais-com-o-devtools-do-browser.md': 'ugse0x82gi',
}

const client = getCliClient({apiVersion: '2026-08-15'})

function keygen(): string {
  return Math.random().toString(36).slice(2, 12)
}

function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

type Span = {_type: 'span'; _key: string; text: string; marks: string[]}
type MarkDef = {_type: 'link'; _key: string; href: string}
type TextBlock = {
  _type: 'block'
  _key: string
  style: 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote'
  listItem?: 'bullet' | 'number'
  level?: number
  markDefs: MarkDef[]
  children: Span[]
}
type CodeBlock = {_type: 'code'; _key: string; language: string; code: string}
type BodyBlock = TextBlock | CodeBlock

const HEADING_STYLE: Record<number, TextBlock['style']> = {
  1: 'h2',
  2: 'h3',
  3: 'h4',
  4: 'h4',
  5: 'h4',
  6: 'h4',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function inlineToSpans(nodes: any[], markDefs: MarkDef[], activeMarks: string[] = []): Span[] {
  const spans: Span[] = []
  for (const node of nodes) {
    switch (node.type) {
      case 'text':
        spans.push({_type: 'span', _key: keygen(), text: node.value, marks: activeMarks})
        break
      case 'strong':
        spans.push(...inlineToSpans(node.children, markDefs, [...activeMarks, 'strong']))
        break
      case 'emphasis':
        spans.push(...inlineToSpans(node.children, markDefs, [...activeMarks, 'em']))
        break
      case 'delete':
        spans.push(...inlineToSpans(node.children, markDefs, [...activeMarks, 'strike-through']))
        break
      case 'inlineCode':
        spans.push({_type: 'span', _key: keygen(), text: node.value, marks: [...activeMarks, 'code']})
        break
      case 'link': {
        const key = keygen()
        markDefs.push({_type: 'link', _key: key, href: node.url})
        spans.push(...inlineToSpans(node.children, markDefs, [...activeMarks, key]))
        break
      }
      case 'break':
        spans.push({_type: 'span', _key: keygen(), text: '\n', marks: activeMarks})
        break
      default:
        // inline images and other unsupported inline nodes are dropped
        break
    }
  }
  return spans
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function textBlock(
  style: TextBlock['style'],
  children: any[],
  extra: Partial<Pick<TextBlock, 'listItem' | 'level'>> = {},
): TextBlock {
  const markDefs: MarkDef[] = []
  const spans = inlineToSpans(children, markDefs)
  return {_type: 'block', _key: keygen(), style, markDefs, children: spans, ...extra}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertNode(node: any, out: BodyBlock[]): void {
  switch (node.type) {
    case 'heading': {
      const block = textBlock(HEADING_STYLE[node.depth] ?? 'normal', node.children)
      if (block.children.length > 0) out.push(block)
      break
    }
    case 'paragraph': {
      const block = textBlock('normal', node.children)
      if (block.children.length > 0) out.push(block)
      break
    }
    case 'blockquote':
      for (const child of node.children) {
        if (child.type === 'paragraph') {
          const block = textBlock('blockquote', child.children)
          if (block.children.length > 0) out.push(block)
        }
      }
      break
    case 'list': {
      const listItem = node.ordered ? 'number' : 'bullet'
      for (const item of node.children) {
        for (const child of item.children) {
          if (child.type === 'paragraph') {
            const block = textBlock('normal', child.children, {listItem, level: 1})
            if (block.children.length > 0) out.push(block)
          }
        }
      }
      break
    }
    case 'code':
      out.push({_type: 'code', _key: keygen(), language: node.lang ?? 'text', code: node.value})
      break
    case 'image':
      // images intentionally skipped (see header comment)
      break
    case 'thematicBreak':
      break
    default:
      break
  }
}

function markdownToBody(markdown: string): BodyBlock[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown)
  const out: BodyBlock[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const node of (tree as any).children) convertNode(node, out)
  return out
}

async function main() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))
  console.log(`Found ${files.length} markdown posts in ${POSTS_DIR}${DRY_RUN ? ' (dry run)' : ''}`)

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8')
    const {data, content} = matter(raw)

    const slug = slugify(String(data.title ?? path.basename(file, '.md')))
    const tags = Array.from(
      new Set(
        [data.category, ...(data.keywords ? String(data.keywords).split(';') : [])]
          .filter(Boolean)
          .map((t) => String(t).trim().toLowerCase())
          .filter((t) => t.length > 0),
      ),
    )

    const publishedAt = data.date
      ? new Date(`${data.date}T12:00:00.000Z`).toISOString()
      : new Date().toISOString()

    const body = markdownToBody(content)

    const doc = {
      _id: `post-${LANGUAGE}-${slug}`,
      _type: 'post',
      title: String(data.title ?? ''),
      slug: {_type: 'slug', current: slug},
      language: LANGUAGE,
      translationKey: TRANSLATION_KEYS[file] ?? keygen(),
      excerpt: data.description ? String(data.description) : undefined,
      body,
      publishedAt,
      tags,
      featured: false,
    }

    if (DRY_RUN) {
      console.log(`[dry-run] ${file} -> ${doc._id}: ${body.length} blocks, tags=${tags.join(',')}`)
      continue
    }

    await client.createOrReplace(doc)
    console.log(`Migrated: ${file} -> ${doc._id} (${body.length} blocks, ${tags.length} tags)`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
