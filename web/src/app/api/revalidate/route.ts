import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import type { NextRequest } from "next/server";

type Payload = {
  _type?: string;
  translationKey?: string;
  language?: "pt" | "en";
};

export async function POST(req: NextRequest) {
  const { isValidSignature, body } = await parseBody<Payload>(
    req,
    process.env.SANITY_REVALIDATE_SECRET,
    true
  );

  if (isValidSignature !== true) {
    return new Response("Invalid signature", { status: 401 });
  }

  if (body?._type !== "post") {
    return Response.json({ revalidated: false, message: "Ignored" });
  }

  // Webhooks are an external trigger that needs data to expire immediately,
  // not the lazy stale-while-revalidate semantics of profile "max".
  if (body.translationKey) {
    revalidateTag(`post:${body.translationKey}`, { expire: 0 });
  }
  revalidateTag("posts:en", { expire: 0 });
  revalidateTag("posts:pt", { expire: 0 });

  return Response.json({ revalidated: true, now: Date.now() });
}
