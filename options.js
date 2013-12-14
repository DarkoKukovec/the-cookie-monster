window.onload = updateData;

function updateData() {
  var lastUpdateTime = localStorage.lastUpdateTime ? new Date(localStorage.lastUpdateTime) : new Date(1970, 0, 0);
  var selectors = localStorage.selectors ? JSON.parse(localStorage.selectors) : {};

  document.querySelector('.update').className = 'update';
  document.querySelector('.update-time').innerHTML = lastUpdateTime.toLocaleString();
  document.querySelector('button').addEventListener('click', function() {
    document.querySelector('.update').className = 'update updating';
    var bg = chrome.extension.getBackgroundPage();
    bg.fetchUpdate(updateData);
  });
  var table = document.querySelector('table');
  var rows = document.querySelectorAll('tr');
  for (var i = 1; i < rows.length; i++) {
    rows[i].remove();
  }
  var keys = [];
  for (var page in selectors) {
    if (selectors.hasOwnProperty(page) && page !== 'global') {
      keys.push(page);
    }
  }
  keys.sort();
  keys.unshift('global');
  for (var j = 0; j < keys.length; j++) {
    var url = document.createElement('td');
    url.innerHTML = keys[j] === 'global' ? 'Catch all' : keys[j];
    var lastUpdated = document.createElement('td');
    lastUpdated.innerHTML = (new Date(selectors[keys[j]].updatedAt)).toLocaleString();
    var selector = document.createElement('td');
    selector.innerHTML = selectors[keys[j]].selector;
    var tr = document.createElement('tr');
    tr.appendChild(url);
    tr.appendChild(lastUpdated);
    tr.appendChild(selector);
    table.appendChild(tr);
  }
}