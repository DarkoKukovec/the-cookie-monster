(function() {
  // Send the url, get the selector if it exists
  chrome.runtime.sendMessage({hostname: window.location.host}, function(selector) {
    if (selector.container) {
      var style = document.createElement('style');
      style.innerHTML = selector.container + ' { display: none !important; }';
      document.head.appendChild(style);
    }
    if (selector.button) {
      window.onload = function() {
        var buttons = document.querySelectorAll(selector.button);
        for (var i = 0; i < buttons.length; i++) {
          buttons[i].click();
        }
      };
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