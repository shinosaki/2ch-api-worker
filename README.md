# 2ch-api-worker

<!-- [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/shinosaki/2ch-api-worker) -->

2ch-api-workerは2ちゃんねる(5ちゃんねる)のHTMLをdat形式に変換するCloudflare Workersアプリケーションです。

## ToDo
- [] linkedomからHTMLRewriterに移行
<!-- - [ ] read.cgi ver 05系に対応 -->
- [ ] サーバー移転の追従  
  <!-- 例えば`https://5ch.net/poverty/1633076823/`にアクセスした場合`https://leia.5ch.net/test/read.cgi/poverty/1633076823/`ではなく`https://greta.5ch.net/test/read.cgi/poverty/1633076823/`にリダイレクトされて「datが存在しません。削除されたかURL間違ってますよ。」と返ってくる。 -->

## 使用方法
~~2chのURL(`https://greta.5ch.net/test/read.cgi/poverty/1653843928/`)のドメイン名部分(`greta.5ch.net`)をWorkerのドメイン名(`2ch.lain.im`)に置き換えてアクセスするだけです。~~  

下記のいずれか(read.cgi or dat)のURL形式に対応してます。

- `https://2ch.lain.im/test/read.cgi/<板/board>/<スレッドID/Thread ID>`
- `https://2ch.lain.im/<板/board>/dat/<スレッドID/Thread ID>`

応答はShift-JISでエンコードされた[2chのdat](https://info.5ch.net/index.php/Monazilla/develop/dat)です。  

URL末尾にクエリパラメータ`?charset=utf-8`を追加するとUTF-8になります。

### chMateの設定
[設定]→[実験的]→[検索に使うURL(追加用)]にコレを入力  
```
過去ログ https://2ch.lain.im/test/read.cgi/{$bbs}/{$key}/
```

## 制限
- 書き込みには対応してないよ！
- 国外IPアドレスからのアクセスは[451 Unavailable For Legal Reasons](https://ja.wikipedia.org/wiki/HTTP_451)で弾かれるみたい

## Deploy
[Deploy Button](https://deploy.workers.cloudflare.com/?url=https://github.com/shinosaki/2ch-api-worker) or

1. `git clone --recursive https://github.com/shinosaki/2ch-api-worker.git`
2. `cd 2ch-api-worker`
3. `npm i`
4. `npx wrangler login`
5. `npm run deploy`

## License
[MIT](https://raw.githubusercontent.com/shinosaki/2ch-api-worker/main/LICENSE)