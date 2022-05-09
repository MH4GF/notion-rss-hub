import { Client } from '@notionhq/client/build/src';
import {
  CreatePageParameters,
  CreatePageResponse,
  QueryDatabaseResponse,
  UpdatePageParameters,
  UpdatePageResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { config } from 'dotenv';

config();

export class Notionclient {
  client;

  constructor() {
    this.client = new Client({ auth: process.env.NOTION_KEY });
  }

  async queryDatabase(databaseId: string, cursor: string | undefined): Promise<QueryDatabaseResponse> {
    try {
      return await this.callWithRetry(() => {
        return this.client.databases.query({ database_id: databaseId, start_cursor: cursor });
      });
    } catch (e) {
      throw `error: ${e}`;
    }
  }

  async createPage(params: CreatePageParameters): Promise<CreatePageResponse> {
    try {
      return await this.callWithRetry(() => {
        return this.client.pages.create(params);
      });
    } catch (e) {
      throw `error: ${e}`;
    }
  }

  async updatePage(params: UpdatePageParameters): Promise<UpdatePageResponse> {
    try {
      return this.callWithRetry(() => {
        return this.client.pages.update(params);
      });
    } catch (e) {
      throw `error: ${e}`;
    }
  }

  private async wait(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  private async callWithRetry<T>(fn: () => Promise<T>, depth = 0): Promise<T> {
    try {
      return await fn();
    } catch (e) {
      if (depth > 5) {
        throw e;
      }

      console.log(`retry when error occured: ${e}`);
      await this.wait(2 ** (depth ** 10));

      return this.callWithRetry(fn, depth + 1);
    }
  }
}
