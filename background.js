var snykurl = "snyk.io";

const browser = window.msBrowser || window.browser || window.chrome;

function showVulnNotification(packageName, packageVersion, vulnCount){
  var vulnerabilitiesPluralized = vulnCount > 1 ? 'vulnerabilities' : 'vulnerability';

  browser.notifications.create({
    type:     'basic',
    iconUrl:  'snyk-avatar-notification.png',
    title:    packageName + '@' + packageVersion,
    message:  `${vulnCount} ${vulnerabilitiesPluralized} found`,
    requireInteraction: false,
    priority: 0
  });
}

function showSafeNotification(packageName, packageVersion = null){
  browser.notifications.create({
    type:     'basic',
    iconUrl:  'snyk-avatar-notification.png',
    title:    [packageName, packageVersion].filter(Boolean).join('@'),
    message:  'No known vulnerabilities found.',
    requireInteraction: false,
    priority: 0
  });
}

browser.runtime.onMessage.addListener( function(request, sender, sendResponse) {
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
    const badgeRequest = fetch(request.testPath + "/badge.svg");

    badgeRequest
      .then(function(response) { return response.text()})
      .then(function(response) {
        const parse = new DOMParser();
        const doc = parse.parseFromString(response, "image/svg+xml");
        const nbOfVuln = parseInt(doc.querySelectorAll('text')[3].innerHTML, 10);

        if (nbOfVuln > 0) {
          showVulnNotification(request.packageName, request.packageVersion, nbOfVuln);
        } else if (nbOfVuln === 0) {
          showSafeNotification(request.packageName, request.packageVersion);
        }
      });
  }
});
