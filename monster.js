(function() {
  // Send the url, get the selector if it exists
  chrome.runtime.sendMessage({hostname: window.location.host}, function(selector) {
    if (selector) {
      var style = document.createElement('style');
      style.innerHTML = selector + ' { display: none !important; }';
      document.head.appendChild(style);
    }
  });

  // Return the current url to the background proces for the report
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    sendResponse({
      host: window.location.host,
      href: window.location.href
    });
  });
})();