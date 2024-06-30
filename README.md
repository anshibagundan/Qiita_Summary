# Qiita_Summary
Qiita専用　記事要約システム

まじでQiitaでしか動きません

# 仕様
GPTのAPIをSCに打ち込むと記事の要約を出力してれる．現状はAPIは何も書いてないが各々SCの
Pythonなら
```py
client = OpenAI(api_key='OpenAIのAPI')
```
chrome拡張機能なら
```js
async function summarizeText(text) {
  const apiKey = 'OpenAIのAPIキー';
```
ここにAPIを入力してみてね

# 例
Pythonでは
<img width="652" alt="スクリーンショット 2024-06-30 16 41 49" src="https://github.com/anshibagundan/Qiita_Summary/assets/131508158/ab26702a-e8ab-403f-a581-35ccc267629c">

Chromeでは
<img width="807" alt="スクリーンショット 2024-06-30 22 07 10" src="https://github.com/anshibagundan/Qiita_Summary/assets/131508158/1cdb378d-95ea-4220-998d-8f388788a781">

# pythonでの実行方法
```bash
docker compose up
```
でライブラリのインストールから実行までいけます．(dockerデーモンは入れてね)

# Chrome拡張機能
普通にChrome拡張機能にこのまま入れるだけ．

## 他のサイトで使うには(pythonでは)
fetch_webpage_text関数の中をいじってね
```py
def fetch_webpage_text(url):
    response = requests.get(url)
    if response.status_code != 200:
        return "ウェブページを取得できませんでした。"

    soup = BeautifulSoup(response.text, 'html.parser')

    all_wrapper = soup.find('div', class_='allWrapper')
    if not all_wrapper:
        return "allWrapperクラスが見つかりません。"

    main_wrapper = all_wrapper.find('div', class_='mainWrapper')
    if not main_wrapper:
        return "mainWrapperクラスが見つかりません。"

    personal_article = main_wrapper.find('div', id=lambda x: x and x.startswith('PersonalArticlePage'))
    if not personal_article:
        return "PersonalArticlePageで始まるIDのdivが見つかりません。"

    p_items_main = personal_article.find('div', class_='p-items_main')
    if not p_items_main:
        return "p-items_mainクラスのdivが見つかりません。"

    paragraphs = p_items_main.find_all('p')
    text_content = ' '.join([paragraph.get_text() for paragraph in paragraphs])
    return text_content

```
ここにタグと，classまたはidを指定すればサイト内の構成をサーチできます
```
soup.find('div', class_='allWrapper')
```
これを何個か組み合わせればdivの下の方に行けます
