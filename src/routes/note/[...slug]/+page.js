import { redirect } from '@sveltejs/kit';

export const load = ({ params }) => {
  const { slug } = params;
  throw redirect(301, `/note#${slug}`);
};