document.getElementById('download').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error('No active tab found');
      return;
    }
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getImages' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message to content script:', chrome.runtime.lastError.message);
        return;
      }
      if (response && response.images) {
        console.log('Received processed image URLs from content script:', response.images);
        chrome.runtime.sendMessage({ action: 'downloadImages', images: response.images }, (downloadResponse) => {
          if (downloadResponse && downloadResponse.status === 'done') {
            console.log('Images downloaded successfully');
          } else {
            console.error('Failed to download images');
          }
        });
      } else {
        console.error('No response or images from content script');
      }
    });
  });
});
