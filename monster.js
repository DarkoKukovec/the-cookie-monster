(function() {
  // Send the url, get the selector if it exists
  var host = window.location.host;
  getSelector(host, function(selector) {
    if (selector) {
      var style = document.createElement('style');
      style.innerHTML = selector + ' { display: none !important; }';
      document.head.appendChild(style);
    }
  });

  function getSelector(host, callback) {
    chrome.runtime.sendMessage({hostname: host}, function(response) {
      callback(response);
    });
  }

  // Return the current url to the background proces for the report
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      sendResponse({
        host: window.location.host,
        href: window.location.href
      });
    });
})();