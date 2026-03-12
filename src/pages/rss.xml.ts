import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getSortedPosts } from '../utils/posts';

export async function GET(context: APIContext) {
  const posts = await getSortedPosts();

  return rss({
    title: 'pragun',
    description: 'Research blog on AI, infrastructure, and systems.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}`,
    })),
  });
}
