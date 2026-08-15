export type PostSummary = {
  _id: string;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  tags: string[] | null;
  featured: boolean | null;
  publishedAt: string | null;
  translationKey: string | null;
};
