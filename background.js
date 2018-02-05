var snykurl = "snyk.io";

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

function showVulnNotification(packageManager,packageName, packageVersion, vulnCount, snykTestUrl){
  var opt = {
      type:     'basic',
      iconUrl:  'snyk-avatar-notification.png',
      title:    packageName + ' ' + packageVersion,
      message:  'This package carries '+vulnCount+ ' known issues',
      requireInteraction: false,
      priority: 0};

      createNotification(snykTestUrl, opt);
}

function showSafeNotification(packageName){
  chrome.notifications.create({
      type:     'basic',
      iconUrl:  'snyk-avatar-notification.png',
      title:    packageName,
      message:  'is vulnerability free !',
      requireInteraction: false,
      priority: 0});

}



  chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.source == "getsnykurl"){
      sendResponse({url: snykurl});
    } else if(request.source == "snykurl"){
      snykurl = request.url;

      var connectionTimeout = setTimeout(function(){
        sendResponse({status: "fail"});
        snykurl = "snyk.io";
        return;
      }, 3000);

      fetch("https://"+snykurl +"/")
      .then(
        function(response) {
          if (response.status !== 200) {
            sendResponse({status: "fail"});
            snykurl = "snyk.io";
            return;
          } else {
            // console.log("success");
            clearTimeout(connectionTimeout);
            snykurl = snykurl;
            sendResponse({status: "success"});

            return;
          }
        }
      )
      .catch(function(err) {
        console.log(err);
        //sendResponse({status: "fail"});
      });
      return true;

    } else {
      var snykTestUrl = "https://"+ snykurl +"/test/"+request.source+'/'+ request.packageName+"/"+ request.packageVersion;
        var xhr = new XMLHttpRequest();

        xhr.open("GET", snykTestUrl +"/badge.svg", false);
        xhr.send();
        if(xhr.status != 200){
          return;
        }
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
            showVulnNotification(request.source, request.packageName, request.packageVersion, nbOfVuln, snykTestUrl);
        } else {
            showSafeNotification(request.packageName)
        }
        sendResponse({nbOfVuln: nbOfVuln, url: snykTestUrl});
    }
  });
