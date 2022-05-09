import { RssArticle } from './RssArticle';
import { describe, test, expect } from 'vitest';

describe('RssArticle', () => {
  describe('#fetchArticles()', () => {
    describe('正常系', () => {
      test.todo('RSSのURLにリクエストした結果が空の場合、空配列が返る');
      test.todo('RSSのURLにリクエストした結果が1つ以上存在する場合、Articleの配列が返る');
    });

    describe('異常系', () => {
      test('urlが空文字の場合エラーが返る', async () => {
        const rssArticle = new RssArticle();
        const feedSource = { Name: '', Url: '' };
        await expect(rssArticle.fetchArticles(feedSource)).rejects.toThrowError(
          new Error('connect ECONNREFUSED 127.0.0.1:80')
        );
      });

      test.todo('urlが不正な値の場合エラーが返る');
      test.todo('URLへのリクエストに失敗した場合、hogehoge');
    });
  });
});
