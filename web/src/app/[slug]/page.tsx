import { PortableText, defineQuery } from "next-sanity";
import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/sanity/client";

const POST_QUERY = defineQuery(
  `*[_type == "post" && slug.current == $slug][0]{ _id, title, body }`
);

const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await client.fetch(POST_QUERY, { slug }, options);

  if (!post) return notFound();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
      <Link className="underline underline-offset-4" href="/">
        ← Back to posts
      </Link>
      <article className="prose">
        <h1 className="text-3xl font-semibold">{post.title}</h1>
        {Array.isArray(post.body) && <PortableText value={post.body} />}
      </article>
    </main>
  );
}
