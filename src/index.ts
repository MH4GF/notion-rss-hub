import { FeedSource, Article } from './types';
import { Client } from '@notionhq/client';
import {
  Page,
  TitlePropertyValue,
  URLPropertyValue,
} from '@notionhq/client/build/src/api-types';
import { InputPropertyValueMap } from '@notionhq/client/build/src/api-endpoints';
import { config } from 'dotenv';
import Parser from 'rss-parser';

config();

const notion = new Client({ auth: process.env.NOTION_KEY });
const parser = new Parser();

async function getFeedSources(): Promise<FeedSource[]> {
  const feedSources: FeedSource[] = [];

  async function getFeedSourcesFromNotion(cursor: string | undefined) {
    const currentPages = await notion.databases.query({
      database_id: process.env.FEED_SOURSES_NOTION_DATABASE_ID,
      start_cursor: cursor,
    });

    for (const page of currentPages.results) {
      if (page.object === 'page') {
        const titleValue = page.properties['sourceName'] as TitlePropertyValue;
        const urlValue = page.properties['sourceUrl'] as URLPropertyValue;
        if (!urlValue.url || !titleValue) {
          throw `sourceName or sourceUrl must be set. page url: ${page.url}`;
        }

        feedSources.push({
          Name: titleValue.title[0].plain_text,
          Url: urlValue.url,
        });
      }
    }
    if (currentPages.has_more && currentPages.next_cursor) {
      await getFeedSourcesFromNotion(currentPages.next_cursor);
    }
  }

  await getFeedSourcesFromNotion(undefined);

  return feedSources;
}

async function findOrCreateOrUpdateArticlePages(articles: Article[]) {
  const articlePages = await getArticlePages();

  for (const article of articles) {
    const page = articlePages.find((articlePage) => {
      const urlValue = articlePage.properties['URL'] as URLPropertyValue;
      return urlValue.url === article.Url;
    });
    if (page) {
      updateArticlePage(page.id, article);
    } else {
      createArticlePage(article);
    }
  }
}

async function getArticlePages(): Promise<Page[]> {
  const pages: Page[] = [];

  async function getArticlePagesFromNotion(cursor: string | undefined) {
    const currentPages = await notion.databases.query({
      database_id: process.env.ARTICLES_NOTION_DATABASE_ID,
      start_cursor: cursor,
    });
    pages.push(...currentPages.results);
    if (currentPages.has_more && currentPages.next_cursor) {
      await getArticlePagesFromNotion(currentPages.next_cursor);
    }
  }

  await getArticlePagesFromNotion(undefined);

  return pages;
}

async function createArticlePage(article: Article) {
  const page = await notion.pages.create({
    parent: {
      database_id: process.env.ARTICLES_NOTION_DATABASE_ID,
    },
    properties: articleProperties(article),
  });
}

async function updateArticlePage(pageId: string, article: Article) {
  const page = await notion.pages.update({
    page_id: pageId,
    archived: false,
    properties: articleProperties(article),
  });
}

function articleProperties(article: Article): InputPropertyValueMap {
  return {
    Name: {
      type: 'title',
      title: [
        {
          type: 'text',
          text: {
            content: article.Title || '',
          },
        },
      ],
    },
    Media: {
      type: 'select',
      select: {
        name: article.FeedSource.Name,
      },
    },
    Published: {
      type: 'date',
      date: {
        start: article.Published || '',
      },
    },
    URL: {
      type: 'url',
      url: article.Url || '',
    },
  };
}

async function fetchArticles(feedSource: FeedSource): Promise<Article[]> {
  const feed = await parser.parseURL(feedSource.Url);
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

async function main() {
  const feedSources = await getFeedSources();
  const articles: Article[] = [];
  for (const feedSource of feedSources) {
    const res = await fetchArticles(feedSource);
    articles.push(...res);
  }
  findOrCreateOrUpdateArticlePages(articles);
}
main();
