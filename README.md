# notion-rss-hub

RSS フィードを Notion に同期するマン

## Description

- Qiita, Zenn, note などの RSS の URL を登録することで、Notion の Database に記事のリンクをまとめることができます。
- RSS フィードを取得できるサイトであれば好きな場所に記事を投稿できるようになり、Notion の Database を利用しているため自由に View を変えたり Filter や Sort を利用できます。
- [super.so](https://super.so/)や[Wraptas](https://wraptas.com/)で自身のポートフォリオサイトとして公開するユースケースを想定しています。
- リポジトリを Fork してご自由にお使いください。

## Demo

[https://mh4gf.dev/](https://mh4gf.dev/)

## Usage

同期は GitHub Actions で行います。発火方法は Schedule もしくは Workflow Dispatch を用意しています。

1. RSS フィードの情報を Notion から取得
2. RSS フィードの URL にそれぞれアクセスし、記事データを取得
3. 同期用 Database に対して、記事 URL をユニークキーとし FindOrCreateOrUpdate

## Installation

1. リポジトリを Fork
2. Notion 上で RSS フィードの設定用 Database と、記事の同期用 Database をテンプレートから複製
3. Notion API の Integrations を Internal integrations で作成し、token を取得
4. 環境変数を設定
5. その他自由にソースコードを修正してください

### 1. リポジトリを Fork

[こちら](https://docs.github.com/ja/github/getting-started-with-github/quickstart/fork-a-repo)を参考に、自身の管理するアカウントにリポジトリをフォークしてください。

### 2. Notion 上で RSS フィードを管理する Database と、記事を同期するための Database をテンプレートから複製

Notion 上で二つの Database を用意します。

- RSS フィード設定用 Database
  - RSS フィードの情報を管理します。設定を Notion 上で行うことで、デプロイレスで設定を更新することができます。
  - テンプレートを用意しているため、自身の Notion workspace に複製し利用してください。
  - https://miyagi-cnw.notion.site/0a3613c46b404c1bbd30067b69b98e94?v=b84d7653fdef4bda9edea1c8ab01566b
- 記事の同期用 Database
  - 記事ごとにページが作成されます。Filter や Sort, View を自由に設定することができます。
  - テンプレートを用意しているため、自身の Notion workspace に複製し利用してください。
  - https://miyagi-cnw.notion.site/4d3cc536be544ce49e7ea4e71dacf521?v=a85ee872bd8d4c6dbc2c7e3da5f38a9c

### 3. Notion API の Integrations を Internal integrations で作成し、token を取得

[Getting Started](https://developers.notion.com/docs/getting-started) を参考にしながらアクセストークンを取得してください。

### 4. 環境変数を設定

[こちら](https://docs.github.com/ja/actions/reference/encrypted-secrets)を参考にフォークした GitHub のリポジトリにシークレットを登録してください。

以下の内容を登録してください。

```
NOTION_KEY=<3で取得したtoken>
FEED_SOURSES_NOTION_DATABASE_ID=<2で作成したRSSフィード設定用DatabaseのID>
ARTICLES_NOTION_DATABASE_ID=<2で作成した記事の同期用DatabaseのID>
```

database_id の取得方法は[こちら](https://developers.notion.com/docs/working-with-databases)を参考にしてください。

### 5. その他自由にソースコードを修正してください

Database の Properties を変えたり、作成する Page の記載内容を変えたい場合は直接コードを修正してください。  
`src/index.ts` がアクセスポイントとなっています。
