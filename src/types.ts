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
