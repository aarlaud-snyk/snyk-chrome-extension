// Copyright (c) 2018 Antoine Arlaud, Snyk Ltd. All rights reserved.

 function showNotification(){
   chrome.notifications.create({
       type:     'basic',
       iconUrl:  'snyk-avatar-notification.png',
       title:    'Stay Secure',
       message:  'Check your dependencies !',
       buttons: [
         {title: 'Snyk Test'}
       ],
       priority: 0});
 }


document.addEventListener('DOMContentLoaded', () => {

  chrome.runtime.sendMessage({source: "getsnykurl" }, function(response) {
      document.getElementById('url').value = response.url;

  });


  document.getElementById('save').addEventListener('click', () => {
      var url = document.getElementById('url').value;
      chrome.runtime.sendMessage({source: "snykurl", url: url }, function(response) {
          document.getElementById('status').textContent = response.status;

      });
  });
});
