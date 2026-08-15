import { client } from "@/sanity/client";
import { defineQuery } from "next-sanity";
import Link from "next/link";

const POSTS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current)] | order(_createdAt desc){ _id, title, slug }`
);

const options = { next: { revalidate: 30 } };

export default async function PostsPage() {
  const posts = await client.fetch(POSTS_QUERY, {}, options);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold">Posts</h1>
      {posts.length === 0 && (
        <p className="text-zinc-500">No posts yet — add one in the Studio.</p>
      )}
      <ul className="flex flex-col gap-3">
        {posts.map((post) => (
          <li key={post._id}>
            <Link
              className="underline underline-offset-4"
              href={`/${post.slug!.current}`}
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
