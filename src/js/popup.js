// Copyright (c) 2018 Antoine Arlaud, Snyk Ltd. All rights reserved.
var snykurl = 'snyk.io';
var token = '';
document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ source: 'getsnykurl' }, (response) => {
    if (response && response.url && response.apiToken) {
      snykurl = response.url;
      token = response.apiToken? response.apiToken : '';
    }
    document.getElementById('url').value = snykurl;
    document.getElementById('token').value = token;
  });

  document.getElementById('save').addEventListener('click', () => {
    var url = document.getElementById('url').value;
    var apiToken = document.getElementById('token').value;
    chrome.runtime.sendMessage({ source: 'snykurl', url, apiToken }, (response) => {
      document.getElementById('status').textContent = response.status;
      if (response.ok) {
        snykurl = url;
        token = apiToken;
      }
    });
  });
});
