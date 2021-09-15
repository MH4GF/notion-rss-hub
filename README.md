# notion-rss-hub

RSSフィードをNotionに同期するマン

## Description

- Qiita, Zenn, noteなどのRSSのURLを登録することで、NotionのDatabaseに記事のリンクをまとめることができます。
- RSSフィードを取得できるサイトであれば好きな場所に記事を投稿できるようになり、NotionのDatabaseを利用しているため自由にViewを変えたりFilterやSortを利用できます。
- [super.so](https://super.so/)や[Wraptas](https://wraptas.com/)で自身のポートフォリオサイトとして公開するユースケースを想定しています。
- リポジトリをForkしてご自由にお使いください。

## Demo

[https://mh4gf.dev/](https://mh4gf.dev/)

## Usage

同期はGitHub Actionsで行います。発火方法はScheduleもしくはWorkflow Dispatchを用意しています。

1. RSSフィードの情報をNotionから取得
2. RSSフィードのURLにそれぞれアクセスし、記事データを取得
3. 同期用Databaseに対して、記事URLをユニークキーとしFindOrCreateOrUpdate


## Installation

1. リポジトリをFork
2. Notion上でRSSフィードの設定用Databaseと、記事の同期用Databaseをテンプレートから複製
3. Notion APIのIntegrationsをInternal integrationsで作成し、tokenを取得
4. 環境変数を設定
5. その他自由にソースコードを修正してください

### 1. リポジトリをFork

[こちら](https://docs.github.com/ja/github/getting-started-with-github/quickstart/fork-a-repo)を参考に、自身の管理するアカウントにリポジトリをフォークしてください。

### 2. Notion上でRSSフィードを管理するDatabaseと、記事を同期するためのDatabaseをテンプレートから複製

Notion上で二つのDatabaseを用意します。

- RSSフィード設定用Database
  - RSSフィードの情報を管理します。設定をNotion上で行うことで、デプロイレスで設定を更新することができます。
  - テンプレートを用意しているため、自身のNotion workspaceに複製し利用してください。
  - https://plain-soursop-4e3.notion.site/0a3613c46b404c1bbd30067b69b98e94?v=b84d7653fdef4bda9edea1c8ab01566b
- 記事の同期用Database
  - 記事ごとにページが作成されます。FilterやSort, Viewを自由に設定することができます。
  - テンプレートを用意しているため、自身のNotion workspaceに複製し利用してください。
  - https://plain-soursop-4e3.notion.site/4d3cc536be544ce49e7ea4e71dacf521?v=a85ee872bd8d4c6dbc2c7e3da5f38a9c

### 3. Notion APIのIntegrationsをInternal integrationsで作成し、tokenを取得

[Getting Started](https://developers.notion.com/docs/getting-started) を参考にしながらアクセストークンを取得してください。

### 4. 環境変数を設定

[こちら](https://docs.github.com/ja/actions/reference/encrypted-secrets)を参考にフォークしたGitHubのリポジトリにシークレットを登録してください。

以下の内容を登録してください。

```
NOTION_KEY=<3で取得したtoken>
FEED_SOURSES_NOTION_DATABASE_ID=<2で作成したRSSフィード設定用DatabaseのID>
ARTICLES_NOTION_DATABASE_ID=<2で作成した記事の同期用DatabaseのID>
```

database_idの取得方法は[こちら](https://developers.notion.com/docs/working-with-databases)を参考にしてください。

### 5. その他自由にソースコードを修正してください

DatabaseのPropertiesを変えたり、作成するPageの記載内容を変えたい場合は直接コードを修正してください。  
`src/index.ts` がアクセスポイントとなっています。
