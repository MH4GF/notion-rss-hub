import Parser from 'rss-parser';
import { FeedSource, Article } from './types';

export class RssArticle {
  rssParser;

  constructor() {
    this.rssParser = new Parser();
  }

  async fetchArticles(feedSource: FeedSource): Promise<Article[]> {
    const feed = await this.rssParser.parseURL(feedSource.Url);
    if (!feed?.items?.length) return [];

    return feed.items.map((item) => {
      return {
        Title: item.title,
        Url: item.link,
        Published: item.isoDate,
        FeedSource: feedSource,
      };
    });
  }
}
