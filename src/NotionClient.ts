import { Client } from '@notionhq/client/build/src';
import {
  InputPropertyValueMap,
  PagesCreateParameters,
  PagesCreateResponse,
  PagesUpdateParameters,
  PagesUpdateResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { PaginatedList, Page } from '@notionhq/client/build/src/api-types';
import { config } from 'dotenv';

config();

export class Notionclient {
  client;

  constructor() {
    this.client = new Client({ auth: process.env.NOTION_KEY });
  }

  // TODO: エラーハンドリング
  async queryDatabase(
    databaseId: string,
    cursor: string | undefined
  ): Promise<PaginatedList<Page>> {
    const currentPages = await this.client.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
    });
    return currentPages;
  }

  // TODO: エラーハンドリング
  async createPage(
    params: PagesCreateParameters
  ): Promise<PagesCreateResponse> {
    return await this.client.pages.create(params);
  }

  // TODO: エラーハンドリング
  async updatePage(
    params: PagesUpdateParameters
  ): Promise<PagesUpdateResponse> {
    return await this.client.pages.update(params);
  }
}
