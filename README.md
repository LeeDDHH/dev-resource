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

// db_origin.jsonをもとに、データにidを付与し、db.jsonに保存する
yarn add-id-data

// 新たに追加したデータのスクショを撮る
yarn screenshots

// スクショを public/image 配下に配置する
yarn mv-screenshots
```
