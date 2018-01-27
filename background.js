
//https://snyk.io/test/github/
//https://snyk.io/test/npm/

function createNotification(url, options, createdCallback) { // callback is optional
  var opt = options;

  chrome.notifications.create(opt, function(createdId) {
    var handler = function(id) {
      if(id == createdId) {

        chrome.tabs.create({url:url}, function(){
          chrome.notifications.clear(id);
          chrome.notifications.onClicked.removeListener(handler);
        });

      }
    };
    chrome.notifications.onClicked.addListener(handler);
    if(typeof createdCallback == "function") createdCallback();
  });
}

function showVulnNotification(packageManager,packageName, vulnCount){
  var opt = {
      type:     'basic',
      iconUrl:  'snyk-avatar-notification.png',
      title:    packageName+ ' is vulnerable !',
      message:  'This package carries '+vulnCount+ ' known vuln(s)',
      requireInteraction: true,
      priority: 0};

      createNotification('https://snyk.io/test/'+packageManager+'/'+packageName, opt);
}

function showSafeNotification(packageName){
  chrome.notifications.create({
      type:     'basic',
      iconUrl:  'snyk-avatar-notification.png',
      title:    packageName+ ' is vulnerability free !',
      message:  'Stay Secure !',
      requireInteraction: false,
      priority: 0});

}

  chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //
    // alert(sender.tab ?
    //             "from a content script:" + sender.tab.url :
    //             "from the extension");


      //request.packageName

      var xhr = new XMLHttpRequest();

      xhr.open("GET", "https://snyk.io/test/"+request.source+'/'+ request.packageName +"/badge.svg", false);
      xhr.send();

      var result = xhr.responseText;
      var el = document.createElement( 'html' );
      el.innerHTML = result;
      // If invalid package name
      result = el.getElementsByClassName('header__title');
      var errorString = "";
      if (request.source == "npm") errorString = "Invalid npm package";
      if(result.length > 0 && result[0].textContent == errorString){
        return;
      }
      // If valid package, parsing svg to extract # of issues.
      result = el.getElementsByTagName( 'text' );
      var nbOfVuln = result[result.length-1].textContent;
      if(parseInt(nbOfVuln) > 0){
          showVulnNotification(request.source, request.packageName, nbOfVuln);
      } else {
          showSafeNotification(request.packageName)
      }

  });
  //
  // function getCurrentTabUrl(callback) {
  //   // Query filter to be passed to chrome.tabs.query - see
  //   // https://developer.chrome.com/extensions/tabs#method-query
  //   var queryInfo = {
  //     active: true,
  //     currentWindow: true
  //   };
  //
  //   chrome.tabs.query(queryInfo, (tabs) => {
  //     // chrome.tabs.query invokes the callback with a list of tabs that match the
  //     // query. When the popup is opened, there is certainly a window and at least
  //     // one tab, so we can safely assume that |tabs| is a non-empty array.
  //     // A window can only have one active tab at a time, so the array consists of
  //     // exactly one tab.
  //     var tab = tabs[0];
  //
  //     // A tab is a plain object that provides information about the tab.
  //     // See https://developer.chrome.com/extensions/tabs#type-Tab
  //     var url = tab.url;
  //
  //     // tab.url is only available if the "activeTab" permission is declared.
  //     // If you want to see the URL of other tabs (e.g. after removing active:true
  //     // from |queryInfo|), then the "tabs" permission is required to see their
  //     // "url" properties.
  //     console.assert(typeof url == 'string', 'tab.url should be a string');
  //
  //     callback(url);
  //   });
  //
  //   // Most methods of the Chrome extension APIs are asynchronous. This means that
  //   // you CANNOT do something like this:
  //   //
  //   // var url;
  //   // chrome.tabs.query(queryInfo, (tabs) => {
  //   //   url = tabs[0].url;
  //   // });
  //   // alert(url); // Shows "undefined", because chrome.tabs.query is async.
  // }

  // This extension loads the saved background color for the current tab if one
  // exists. The user can select a new background color from the dropdown for the
  // current page, and it will be saved as part of the extension's isolated
  // storage. The chrome.storage API is used for this purpose. This is different
  // from the window.localStorage API, which is synchronous and stores data bound
  // to a document's origin. Also, using chrome.storage.sync instead of
  // chrome.storage.local allows the extension data to be synced across multiple
  // user devices.
    //
    // getCurrentTabUrl((url) => {
    //
    //   alert("url is =>"+url);
    // });
