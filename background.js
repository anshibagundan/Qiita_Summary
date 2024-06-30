console.log("Background script loaded");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Message received in background:", request);

  if (request.action === "summarize") {
    summarizeText(request.text)
      .then(summary => {
        console.log("Summary generated:", summary);
        sendResponse({summary: summary});
      })
      .catch(error => {
        console.error('Error:', error);
        sendResponse({summary: "要約の取得に失敗しました。"});
      });
    return true;
  }
});

async function summarizeText(text) {
  const apiKey = 'OpenAIのAPIキー';
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {role: "system", content: "あなたは文章を要約する便利なアシスタントです。日本語で要約を提供してください。"},
          {role: "user", content: `以下の文章を要約してください：\n\n${text}`}
        ],
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "テキストの要約中にエラーが発生しました。";
  }
}
