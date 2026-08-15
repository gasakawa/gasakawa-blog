import { defineQuery } from "next-sanity";

export const POSTS_BY_LANG_QUERY = defineQuery(`
  *[_type == "post" && language == $lang && defined(slug.current)]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    tags,
    featured,
    publishedAt,
    translationKey
  }
`);

export const POST_QUERY = defineQuery(`
  *[_type == "post" && language == $lang && slug.current == $slug][0]{
    _id,
    title,
    excerpt,
    publishedAt,
    tags,
    translationKey,
    language,
    "slug": slug.current,
    coverImage{
      alt,
      hotspot,
      crop,
      asset,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    },
    body[]{
      ...,
      _type == "image" => {
        alt,
        hotspot,
        crop,
        asset,
        "lqip": asset->metadata.lqip,
        "dimensions": asset->metadata.dimensions
      }
    }
  }
`);

export const POST_TRANSLATION_QUERY = defineQuery(`
  *[_type == "post" && translationKey == $translationKey && language != $language][0]{
    "slug": slug.current,
    language
  }
`);

export const POSTS_BY_TAG_QUERY = defineQuery(`
  *[_type == "post" && language == $lang && $tagName in tags]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    tags,
    featured,
    publishedAt,
    translationKey
  }
`);

export const RSS_POSTS_QUERY = defineQuery(`
  *[_type == "post" && language == $lang && defined(slug.current)]
  | order(publishedAt desc) [0...20] {
    title,
    excerpt,
    "slug": slug.current,
    publishedAt
  }
`);

export const SITEMAP_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  | order(publishedAt desc) {
    "slug": slug.current,
    language,
    publishedAt
  }
`);
