import requests
from bs4 import BeautifulSoup
from openai import OpenAI


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


def summarize_text(text):
    client = OpenAI(api_key='OpenAIのAPI')

    prompt = f"以下の文章を要約してください：\n\n{text}"
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "あなたは文章を要約する便利なアシスタントです。日本語で要約を提供してください。"},
            {"role": "user", "content": prompt}
        ],
        max_tokens=300
    )
    return response.choices[0].message.content.strip()


def main():
    url = input("URLを入力してください\n")
    print("ページを取得しています...")
    text = fetch_webpage_text(url)
    print(text)
    print("テキストを要約しています...")

    summary = summarize_text(text)
    print("要約:")
    print(summary)


if __name__ == "__main__":
    main()
