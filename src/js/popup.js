// Copyright (c) 2018 Antoine Arlaud, Snyk Ltd. All rights reserved.
document.addEventListener('DOMContentLoaded', () => {

  chrome.runtime.sendMessage({ source: 'getsnykurl' }, (response) => {
    document.getElementById('url').value = response.url;
  });

  document.getElementById('save').addEventListener('click', () => {
    var url = document.getElementById('url').value;
    chrome.runtime.sendMessage({ source: 'snykurl', url }, (response) => {
      document.getElementById('status').textContent = response.status;
    });
  });
});
