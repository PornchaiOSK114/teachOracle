import * as content from './content';
import type { ArticleMeta } from './types';
export const getAllArticles = () => content.getAllArticles('en');
export const getArticleSlugs = () => content.getArticleSlugs('en');
export const getArticle = (slug: string) => content.getArticle(slug, 'en');
export const getRelatedArticles = (article: ArticleMeta) => content.getRelatedArticles(article, 3, 'en');
export const getAllCategoriesInUse = () => content.getAllCategoriesInUse('en');
export { extractHeadings } from './content';
export const formatDateThai = (date: string) => new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'Asia/Bangkok' }).format(new Date(date));
