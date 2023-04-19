# 2ch-api-worker
2ch-api-workerは[2chproxy.pl](https://github.com/yama-natuki/2chproxy.pl)にインスパイアされたプロジェクトで、2chのread.cgiが生成するHTMLをdat形式に変換するCloudflare Workersアプリケーションです。

## ToDo
- [ ] read.cgi ver 05系に対応
- [ ] サーバー移転の追従
  例えば`https://5ch.net/poverty/1633076823/`にアクセスした場合`https://leia.5ch.net/test/read.cgi/poverty/1633076823/`ではなく`https://greta.5ch.net/test/read.cgi/poverty/1633076823/`にリダイレクトされて「datが存在しません。削除されたかURL間違ってますよ。」と返ってくる。

## 使用方法
2chのスレ(`https://greta.5ch.net/test/read.cgi/poverty/1653843928/`)のドメイン名部分(`greta.5ch.net`)をWorkerのドメイン名(`2ch.lain.im`)に置き換えてアクセスするだけです。

応答はShift-JISでエンコードされた[2chのdat](https://info.5ch.net/index.php/Monazilla/develop/dat)です。

### chMateの設定
### JDimの設定
### Sikiの設定

## 制限
- 書き込みには対応してないよ！
- 国外IPアドレスからのアクセスは[451 Unavailable For Legal Reasons](https://ja.wikipedia.org/wiki/HTTP_451)で弾かれるみたい![ムカつく](https://cdn.discordapp.com/emojis/498186332066152459.png?size=64)
  *正確に言うとクライアントから最も近いCloudflareエッジサーバー経由でアクセスしてる*
