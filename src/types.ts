import { Client } from '@notionhq/client';

export type FeedSource = {
  Name: string;
  Url: string;
};

export type Article = {
  Title?: string;
  Url?: string;
  Published?: string;
  FeedSource: FeedSource;
};

type ElementType<T> = T extends (infer U)[] ? U : never;
type MatchType<T, U, V = never> = T extends U ? T : V;
export type PageObject = MatchType<
  ElementType<Awaited<ReturnType<Client['databases']['query']>>['results']>,
  {
    properties: unknown;
  }
>;
