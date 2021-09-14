declare namespace NodeJS {
  interface ProcessEnv {
    readonly NOTION_KEY: string;
    readonly FEED_SOURSES_NOTION_DATABASE_ID: string;
    readonly ARTICLES_NOTION_DATABASE_ID: string;
  }
}
