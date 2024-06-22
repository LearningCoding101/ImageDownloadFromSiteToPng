chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  if (message.action === 'getImages') {
    const images = document.querySelectorAll('img');
    const urls = Array.from(images).map(img => img.src);
    console.log('Found image URLs:', urls);

    Promise.all(
      urls.map(url => fetch(url).then(response => response.blob()))
    ).then(blobs => {
      const processedImages = blobs.map(blob => {
        return new Promise((resolve) => {
          const img = document.createElement('img');
          img.src = URL.createObjectURL(blob);
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(blob => {
              resolve({url: URL.createObjectURL(blob), filename: 'image.png'});
            }, 'image/png');
          };
        });
      });

      Promise.all(processedImages).then(images => {
        sendResponse({images});
      });
    });

    // Return true to indicate we will send a response asynchronously
    return true;
  }
});
