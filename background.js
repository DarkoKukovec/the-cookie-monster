// Parse
var appID = 'H4DnNHgXcQVxwnUoHiO5L8umYjwBJmIdJDAzPSQg';
var restKey = 'ICp5oCWSTYXA4RnP1gaLqIP6ilJkOq4r3nM0K08A';
var updateInterval = 60 * 60 * 1000;

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

// Load the data
var lastUpdateTime = localStorage.lastUpdateTime ? new Date(localStorage.lastUpdateTime) : new Date(1970, 0, 0);
var selectors = localStorage.selectors ? JSON.parse(localStorage.selectors) : {};

// Return the selector for a hostname in the tab
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.update) {
      fetchUpdate(function() {
        sendResponse(null);
      });
    } else if (request.hostname) {
      var host = request.hostname.split('.');
      while(host.length) {
        var hostname = host.join('.');
        if (selectors[hostname]) {
          sendResponse(selectors[hostname].selector);
          return;
        }
        host.shift();
      }
      sendResponse(selectors['global'].selector);
    }
  });

// Auto update
setInterval(fetchUpdate, updateInterval);
fetchUpdate();
function fetchUpdate(callback) {
  var updateUrl = 'https://api.parse.com/1/classes/Blocked';
  var updateDate = new Date(lastUpdateTime);
  updateDate.setDate(updateDate.getDate() - 1); // Update for a day more - just to avoid the timezone confusion
  var data = {
    updatedAt: {
      $gt: {
        __type: 'Date',
        iso: updateDate.toISOString()
      }
    }
  };
  doRequest(updateUrl + '?where=' + JSON.stringify(data), null, function(response) {
    // Parse update data
    var blocked = JSON.parse(response.responseText);
    for (var i = 0; i < blocked.results.length; i++) {
      if (blocked.results[i].selector === '-') {
        delete selectors[blocked.results[i].hostname];
      } else {
        selectors[blocked.results[i].hostname] = blocked.results[i];
      }
    }
    localStorage.selectors = JSON.stringify(selectors);
    lastUpdateTime = localStorage.lastUpdateTime = new Date();
    if (callback) {
      callback();
    }
  });
}

// Report the current page
function reportPage() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {report: true}, function(url) {
      var reportUrl = 'https://api.parse.com/1/classes/Reports';
      if (confirm('Report ' + url.host + '?')) {
        var data = {
          host: url.host,
          url: url.href,
          ua: window.navigator.userAgent
        };
        doRequest(reportUrl, data, function() {});
      }
    });
  });
}

function doRequest(url, data, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      callback(xmlhttp);
    }
  };
  xmlhttp.open(data ? 'POST' : 'GET', url, true);
  xmlhttp.setRequestHeader('X-Parse-Application-Id', appID);
  xmlhttp.setRequestHeader('X-Parse-REST-API-Key', restKey);
  xmlhttp.setRequestHeader('Content-Type', 'application/json');
  xmlhttp.send(data ? JSON.stringify(data) : null);
}