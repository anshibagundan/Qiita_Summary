# Qiita_Summary
Qiita専用　記事要約システム

# 仕様
GPTのAPIをSCに打ち込むと記事の要約を出力してれる．現状はAPIは何も書いてないが各々SCの
```py
client = OpenAI(api_key='OpenAIのAPI')
```
ここにAPIを入力してみてね

# 例
<img width="652" alt="スクリーンショット 2024-06-30 16 41 49" src="https://github.com/anshibagundan/Qiita_Summary/assets/131508158/ab26702a-e8ab-403f-a581-35ccc267629c">

# 実行方法
```bash
docker compose up
```
でライブラリのインストールから実行までいけます．(dockerデーモンは入れてね)
