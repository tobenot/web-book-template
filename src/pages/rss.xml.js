import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const docs = await getCollection('docs', ({ data }) => !data.draft);

  // 排序：按文件 id（前缀 01-, 02- 已经天然有序）
  const sorted = docs.sort((a, b) => a.id.localeCompare(b.id));

  return rss({
    title: '你的书名',
    description: '这本书讲什么、写给谁——和 astro.config.mjs 里的 bookDescription 保持一致。',
    site: context.site,
    items: sorted.map((doc) => ({
      title: doc.data.title,
      pubDate: doc.data.lastUpdated instanceof Date ? doc.data.lastUpdated : new Date(),
      description: doc.data.summary || doc.data.description || '',
      link: `/${doc.id}/`,
      categories: [
        doc.data.chapterType,
        doc.data.difficulty,
      ].filter(Boolean),
    })),
    customData: '<language>zh-cn</language>',
  });
}
