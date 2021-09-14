import { RssArticle } from './RssArticle';

describe('RssArticle', () => {
  describe('#fetchArticles()', () => {
    describe('正常系', () => {
      it.todo('RSSのURLにリクエストした結果が空の場合、空配列が返る');
      it.todo('RSSのURLにリクエストした結果が1つ以上存在する場合、Articleの配列が返る');
    });

    describe('異常系', () => {
      it('urlが空文字の場合エラーが返る', async () => {
        const rssArticle = new RssArticle();
        const feedSource = { Name: '', Url: '' };
        await expect(rssArticle.fetchArticles(feedSource)).rejects.toThrowError(
          new Error('connect ECONNREFUSED 127.0.0.1:80')
        );
      });

      it.todo('urlが不正な値の場合エラーが返る');
      it.todo('URLへのリクエストに失敗した場合、hogehoge');
    });
  });
});
