# dev-resource

開発に役立ちそうなリソースを集める

## ライブラリ

|         名前         | バージョン |
| :------------------: | :--------: |
|       Node.js        |  18.12.0   |
|         npm          |   8.19.2   |
|       next.js        |   13.2.4   |
|        react         |   18.2.0   |
|      react-dom       |   18.2.0   |
|       graphql        |   16.6.0   |
|    @apollo/client    |   3.7.3    |
|    @apollo/server    |   4.3.0    |
| @graphql-codegen/cli |   2.16.2   |
|        eslint        |   8.36.0   |
|       pretter        |   2.8.7    |
|      typescript      |   5.0.2    |

## コマンド

```shell
yarn dev
yarn build
yarn start
```

## コンテンツ収集時

- 収集するページの url を `lib/data.txt` に集約する
- 以下の順でコマンドを実行する

```shell
// data.txtをもとに、新たなデータをdb_origin.jsonに保存する
yarn add-new-data

// db_tags.jsonをもとに、データにタグを付与し、db_origin.jsonに保存する
yarn add-tag-data

// db_origin.jsonをもとに、データにidを付与し、db.jsonに保存する
yarn add-id-data

// 新たに追加したデータのスクショを撮る
yarn screenshots

// スクショを public/image 配下に配置する
yarn mv-screenshots
```

## タグ一覧の更新

```
// db_origin.jsonをもとに、ユニークなタグの配列ををdb_tags.jsonに保存する
yarn add-new-data
```

## graphql 関連ファイルの相関関係

### フロント関連ファイル

- `graphql` 配下
  - 型参照時に使うファイルを生成しておく
- `lib/apollo-client.ts`
  - フロント側で扱う GraphQL の Apollo クライアント

### バック関連ファイル

- `apollo` 配下
  - バック側で扱う GraphQL の Schema ファイルとリゾルバ
- `lib/resolverUtils.ts`
  - リゾルバで解決しようとするロジック
- `pages/api/graphql.ts`
  - バック側で扱う GraphQL の Apollo サーバー
