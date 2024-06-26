# dev-resource

開発に役立ちそうなリソースを集める

## ライブラリ

|         名前         | バージョン |
| :------------------: | :--------: |
|       Node.js        |  18.17.1   |
|         npm          |   9.6.7    |
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

## Vercel から Cloudflare に乗り換える際

- [Migrating from Vercel to Pages · Cloudflare Pages docs](https://developers.cloudflare.com/pages/migrations/migrating-from-vercel/)
  - 基本的に Vercel でデプロイしているプロジェクトの情報を抑えておく
    - ビルドコマンド
    - ビルド結果のディレクトリ
    - 環境変数
- Cloudflare でビルド失敗になったら、 `vercel build` コマンドで何が問題かを見る
- API Routes（ `pages/api` 配下）においた Cloudflare Edge Computing はCloudflare Workersを使う
- パッケージの依存関係でインストール時に `--legacy-peer-deps` を追加する必要がある
  - `@cloudflare/next-on-pages` が `vercel` の `30.0.0` と依存関係にある
  - しかし、 `vercel` コマンドを `30.0.0` にすると利用する上でクリティカルな脆弱性があるライブラリを使うことになり、最新版にする必要がある
  - この状態で通常のインストールをすると、ライブラリ同士のバージョンが一致しないという警告が出るため、 `--legacy-peer-deps` を追加する
    - ただ、 Cloudflare Pages でビルドコマンドは指定できるものの、インストール時のオプションは直接指定ができないため、 `.npmrc` で指定する
    - [google app engine - How can I deploy an app using legacy peer deps? - Stack Overflow](https://stackoverflow.com/questions/73381958/how-can-i-deploy-an-app-using-legacy-peer-deps)
    - [[Laravel×React].npmrcに–legacy-peer-depsの設定を書く｜ytmemo](https://ytmemo.com/npmrc-setting/)

## `node`、`npm` のバージョンを上げるタイミング

- CloudFlareの[Language support and tools](https://developers.cloudflare.com/pages/configuration/language-support-and-tools/)を見て判断する

## 新しい環境で構築する場合

- `.env.sample` をコピーして `.env` ファイルを作成する

## トラブルシューティング

### Electron関連でエラーが起きる

```
Error: GET https://github.com/electron/electron/releases/download/v2.0.18/electron-v2.0.18-darwin-arm64.zip returned 404
︙
Error: Failed to find Electron v2.0.18 for darwin-arm64
```

- `free-translate` の依存関係にある `nightmare` で起きたエラー
- M1系のハードウェアがElectron11から対応する
  - [reactjs - Electron issue with Mac M1 - Stack Overflow](https://stackoverflow.com/questions/66302881/electron-issue-with-mac-m1)
  - [Electron 11.0.0 | Electron](https://www.electronjs.org/blog/electron-11-0#highlight-features)
- 最低限、M系のMacで動けばOKなので、 `package.json` で `"electron": "11.0.0"` とオーバーライドすると解決
  - [Cannot install macOS m1 cpu · Issue #1636 · segment-boneyard/nightmare](https://github.com/segment-boneyard/nightmare/issues/1636#issuecomment-1627501572)
