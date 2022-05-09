import { FeedSource, Article, PageObject } from './types';
import { config } from 'dotenv';
import { RssArticle } from './RssArticle';
import { Notionclient } from './NotionClient';
import { UpdatePageParameters, CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';

config();

const notionClient = new Notionclient();

async function getFeedSources(): Promise<FeedSource[]> {
  const feedSources: FeedSource[] = [];

  async function getFeedSourcesFromNotion(cursor: string | undefined) {
    const response = await notionClient.queryDatabase(process.env.FEED_SOURSES_NOTION_DATABASE_ID, cursor);
    const pages = response.results as PageObject[];

    for (const page of pages) {
      if (page.object === 'page') {
        const titleValue = page.properties['sourceName'].type === 'title' && page.properties['sourceName'].title;
        const urlValue = page.properties['sourceUrl'].type === 'url' && page.properties['sourceUrl'].url;
        if (!urlValue || !titleValue) {
          throw `sourceName or sourceUrl must be set. page url: ${page.url}`;
        }

        feedSources.push({
          Name: titleValue.map((t) => t.plain_text).join(''),
          Url: urlValue,
        });
      }
    }
    if (response.has_more && response.next_cursor) {
      await getFeedSourcesFromNotion(response.next_cursor);
    }
  }

  await getFeedSourcesFromNotion(undefined);

  return feedSources;
}

async function findOrCreateOrUpdateArticlePages(articles: Article[]) {
  const articlePages = await getArticlePages();

  for (const article of articles) {
    const page = articlePages.find((articlePage) => {
      const url = articlePage.properties['URL'].type === 'url' && articlePage.properties['URL'].url;
      return url === article.Url;
    });
    if (page) {
      updateArticlePage(page.id, article);
    } else {
      createArticlePage(article);
    }
  }
}

async function getArticlePages(): Promise<PageObject[]> {
  const pages: PageObject[] = [];

  async function getArticlePagesFromNotion(cursor: string | undefined) {
    const currentPages = await notionClient.queryDatabase(process.env.ARTICLES_NOTION_DATABASE_ID, cursor);
    pages.push(...(currentPages.results as PageObject[]));

    if (currentPages.has_more && currentPages.next_cursor) {
      await getArticlePagesFromNotion(currentPages.next_cursor);
    }
  }

  await getArticlePagesFromNotion(undefined);

  return pages;
}

async function createArticlePage(article: Article) {
  await notionClient.createPage({
    parent: {
      database_id: process.env.ARTICLES_NOTION_DATABASE_ID,
    },
    properties: articleProperties(article),
    children: [
      {
        object: 'block',
        type: 'bookmark',
        bookmark: {
          url: article.Url || '',
        },
      },
    ],
  });
}

async function updateArticlePage(pageId: string, article: Article) {
  await notionClient.updatePage({
    page_id: pageId,
    archived: false,
    properties: articleProperties(article),
  });
}

// TODO: キーを変更可能にする
function articleProperties(article: Article): CreatePageParameters['properties'] {
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

async function main() {
  const rssArticle = new RssArticle();
  const feedSources = await getFeedSources();
  const articles: Article[] = [];
  for (const feedSource of feedSources) {
    const res = await rssArticle.fetchArticles(feedSource);
    articles.push(...res);
  }
  findOrCreateOrUpdateArticlePages(articles);
}
main();
