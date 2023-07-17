# dev-resource

開発に役立ちそうなリソースを集める

## ライブラリ

|         名前         | バージョン |
| :------------------: | :--------: |
|       Node.js        |  18.12.0   |
|         npm          |   9.6.6    |
|    @apollo/client    |   3.7.17   |
|    @apollo/server    |   4.7.5    |
|       graphql        |   16.7.1   |
|       next.js        |  13.4.10   |
|        react         |   18.2.0   |
|      react-dom       |   18.2.0   |
| @graphql-codegen/cli |   4.0.1    |
|        eslint        |   8.45.0   |
|       kuromoji       |   0.1.2    |
|      playwright      |   1.36.1   |
|       pretter        |   2.8.8    |
|      storybook       |   7.0.27   |
|     tailwindcss      |   3.3.3    |
|      typescript      |   5.1.6    |

## コマンド

```shell
yarn dev
yarn build
yarn start
yarn sb
yarn build:sb
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

```shell
// db_origin.jsonをもとに、ユニークなタグの配列ををdb_tags.jsonに保存する
yarn add-new-data
```

## graphql 関連ファイルの相関関係

### フロント関連ファイル

- `graphql` 配下
  - 型参照時に使うファイルを生成しておく
- `lib/apollo/apollo-client.ts`
  - フロント側で扱う GraphQL の Apollo クライアント

### バック関連ファイル

- `apollo` 配下
  - バック側で扱う GraphQL の Schema ファイルとリゾルバ
- `lib/apollo/resolverUtils.ts`
  - リゾルバで解決しようとするロジック
- `pages/api/graphql.ts`
  - バック側で扱う GraphQL の Apollo サーバー

## 分析・解析

### ビルドにかかった時間を解析

- [Next.js 製アプリケーションのコンパイルを約 100 倍高速化した話](https://zenn.dev/mkt/articles/543669021d9a1e)
  - `.next/trace`
    - Next.js はプロセスの終了時に吐き出す機構
    - コンパイルの種類とコンパイルにかかった時間（duration）が記載されている
    - [NextJs compiling extremely slow · Issue #29559 · vercel/next.js](https://github.com/vercel/next.js/issues/29559#issuecomment-938431883)
- [next.js/scripts/trace-to-tree.mjs at canary · vercel/next.js](https://github.com/vercel/next.js/blob/canary/scripts/trace-to-tree.mjs)
  - trace ファイルのパスをパラメタとして渡すことで各処理時間をツリー構造で表示してくれる
- `event-stream` パッケージが必要だったため、追加でインストール済み

```shell
yarn trace-tree
```

### バンドル時のファイルサイズを解析

- `@next/bundle-analyzer` でバンドルサイズを解析する
- `.next\analyze\client.html`
  - ブラウザ側で使用される Js、Css のサイズを表示する
- サイズの種類
  - Stat size
    - アプリを実行するためにブラウザがダウンロードして実行する必要がある JavaScript のサイズ
  - Parsed size
    - JavaScript 実行後に Web ブラウザーで占有されるメモリの量
  - Gzipped size
    - アプリを実行するためにブラウザがダウンロードして実行する必要がある JavaScript(Gzip アルゴリズムを使用して圧縮済み)
- [Next.js のアプリケーションでバンドルサイズを改善した話 | masayanblog](https://maasaablog.com/development/frontend/nextjs/6361/)
- [@next/bundle-analyzer が本番環境で読み込まれないようにする](https://zenn.dev/catnose99/scraps/661d77118aa2af)

```shell
yarn analyze-bundle
```
