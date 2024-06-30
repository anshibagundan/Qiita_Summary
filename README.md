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

## 他のサイトで使うには
fetch_webpage_text関数の中をいじってね
```
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
ここにタグと，classまたはidを指定すればサーチできます
```
soup.find('div', class_='allWrapper')
```
これを何個か組み合わせればdivの下の方に行けます
