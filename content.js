let tooltip;
const displayedUrls = new Set();
const displayTimeout = 60000; // 60秒

function showTooltip(element, text) {
  if (tooltip) {
    document.body.removeChild(tooltip);
  }

  tooltip = document.createElement('div');
  tooltip.textContent = text;
  tooltip.style.position = 'absolute';
  tooltip.style.backgroundColor = 'white';
  tooltip.style.border = '1px solid black';
  tooltip.style.padding = '10px';
  tooltip.style.zIndex = '1000';
  tooltip.style.maxWidth = '300px';

  let rect = element.getBoundingClientRect();
  tooltip.style.top = `${rect.bottom + window.scrollY}px`;
  tooltip.style.left = `${rect.left + window.scrollX}px`;

  document.body.appendChild(tooltip);

  element.addEventListener('mouseout', function handleMouseOut() {
    if (tooltip) {
      document.body.removeChild(tooltip);
      tooltip = null;
    }
    element.removeEventListener('mouseout', handleMouseOut);
  });
}

document.addEventListener('mouseover', function(event) {
  if ((event.target.tagName === 'H1' || event.target.tagName === 'H2') && !displayedUrls.has(window.location.href)) {
    let url = window.location.href;

    displayedUrls.add(url);
    setTimeout(() => {
      displayedUrls.delete(url);
    }, displayTimeout);

    fetch(url)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const allWrapper = doc.querySelector('.allWrapper');
        if (!allWrapper) return;

        const mainWrapper = allWrapper.querySelector('.mainWrapper');
        if (!mainWrapper) return;

        const personalArticle = mainWrapper.querySelector('[id^="PersonalArticlePage"]');
        if (!personalArticle) return;

        const pItemsMain = personalArticle.querySelector('.p-items_main');
        if (!pItemsMain) return;

        const paragraphs = pItemsMain.querySelectorAll('p');
        const textContent = Array.from(paragraphs).map(p => p.textContent).join(' ');

        chrome.runtime.sendMessage({action: "summarize", text: textContent}, function(response) {
          if (response.summary) {
            showTooltip(event.target, response.summary);
          }
        });
      });
  }
});
