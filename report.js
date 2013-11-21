(function() {
  // Reporting
  var url = 'https://api.parse.com/1/classes/Sites';
  var appID = 'H4DnNHgXcQVxwnUoHiO5L8umYjwBJmIdJDAzPSQg';
  var restKey = 'ICp5oCWSTYXA4RnP1gaLqIP6ilJkOq4r3nM0K08A';

  // Create one test item for each context type.
  var contexts = ["page","selection","link","editable","image","video",
                  "audio"];
  for (var i = 0; i < contexts.length; i++) {
    var context = contexts[i];
    var title = "Omnomnom this page";
    var id = chrome.contextMenus.create({
      "title": title,
      "contexts":[context],
      "onclick": reportPage
    });
  }

  function reportPage() {
    // TODO: This gets the extension URL, not the page url
    if (confirm('Report ' + window.location.host + '?')) {
      doReport();
    }
  }

  function doReport() {
    var data = {
      host: window.location.host,
      url: window.location.href,
      ua: window.navigator.userAgent
    };
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      }
    };
    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader('X-Parse-Application-Id', appID);
    xmlhttp.setRequestHeader('X-Parse-REST-API-Key', restKey);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify(data));
  }
})();