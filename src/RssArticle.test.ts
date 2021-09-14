import { RssArticle } from './RssArticle';

describe('RssArticle', () => {
  describe('#fetchArticles()', () => {
    describe('異常系', () => {
      it('urlが空文字の場合エラーが返る', async () => {
        const rssArticle = new RssArticle();
        const feedSource = { Name: '', Url: '' };
        await expect(rssArticle.fetchArticles(feedSource)).rejects.toThrowError(
          new Error('connect ECONNREFUSED 127.0.0.1:80')
        );
      });
    });
  });
});
