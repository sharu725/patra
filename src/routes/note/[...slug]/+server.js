import { redirect } from "@sveltejs/kit";

export function GET({ params }) {
  const { slug } = params;
  throw redirect(301, `/note#${slug}`);
}
