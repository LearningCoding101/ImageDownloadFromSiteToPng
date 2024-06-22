chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background script received message:', message);
  if (message.action === 'downloadImages') {
    message.images.forEach((image, index) => {
      chrome.downloads.download({
        url: image.url,
        filename: `image${index}.png`
      });
    });
    sendResponse({status: 'done'});
  }
});
