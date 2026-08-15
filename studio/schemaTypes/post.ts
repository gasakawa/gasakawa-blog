import { defineArrayMember, defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) =>
        Rule.required().custom(async (slug, context) => {
          if (!slug?.current) return true

          const { document, getClient } = context
          if (!document?._id) return true

          const language = (document as { language?: string }).language
          const client = getClient({ apiVersion: '2026-08-15' })
          const id = document._id.replace(/^drafts\./, '')
          const params = {
            draft: `drafts.${id}`,
            published: id,
            slug: slug.current,
            language,
          }
          const query = `*[_type == "post" && slug.current == $slug && language == $language && !(_id in [$draft, $published])][0]._id`
          const existingId = await client.fetch(query, params)

          return existingId ? 'Slug already used for this language' : true
        }),
    }),
    defineField({
      name: 'language',
      type: 'string',
      options: {
        list: [
          { title: 'Português', value: 'pt' },
          { title: 'English', value: 'en' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'translationKey',
      type: 'string',
      description:
        'Shared identifier linking this post to its translation. Use the same value in both language versions of a post.',
      initialValue: () => Math.random().toString(36).slice(2, 10),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(280),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            annotations: [
              defineField({
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({ scheme: ['http', 'https', 'mailto'] }),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      options: { dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      description: 'Use lowercase, kebab-case tags (e.g. "next-js").',
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      language: 'language',
      publishedAt: 'publishedAt',
      media: 'coverImage',
    },
    prepare({ title, language, publishedAt, media }) {
      const date = publishedAt
        ? new Date(publishedAt).toISOString().slice(0, 10)
        : 'no date'
      return {
        title,
        subtitle: `${language ? language.toUpperCase() : '??'} · ${date}`,
        media,
      }
    },
  },
})
