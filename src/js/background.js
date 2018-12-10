var snykurl = 'snyk.io';

const browser = window.msBrowser || window.browser || window.chrome;

function showVulnNotification(packageName, packageVersion, vulnCount) {
  var vulnerabilitiesPluralized = vulnCount > 1 ? 'vulnerabilities' : 'vulnerability';

  browser.notifications.create({
    type:     'basic',
    iconUrl:  'src/icons/snyk-avatar-notification.png',
    title:    packageName + '@' + packageVersion,
    message:  `${vulnCount} ${vulnerabilitiesPluralized} found`,
    requireInteraction: false,
    priority: 0,
  });
}

function showSafeNotification(packageName, packageVersion = null) {
  browser.notifications.create({
    type:     'basic',
    iconUrl:  'src/icons/snyk-avatar-notification.png',
    title:    [ packageName, packageVersion ].filter(Boolean).join('@'),
    message:  'No known vulnerabilities found.',
    requireInteraction: false,
    priority: 0,
  });
}



// Adding listeners for client side navs
chrome.webNavigation.onHistoryStateUpdated.addListener(() => {
  chrome.tabs.executeScript({ file: 'src/js/content/snyk.js' });
}, { url: [ { urlMatches: 'https://app.snyk.io/org/.+/project/.+\?.*tab=dependencies' } ] });

chrome.webNavigation.onHistoryStateUpdated.addListener(() => {
  chrome.tabs.executeScript({ file: 'src/js/content/npm.js' });
}, { url: [ { urlMatches: 'https://www.npmjs.com/package/.+/*v*/*/*.+' } ] });

browser.runtime.onMessage.addListener( (request, sender, sendResponse) => {
  if (request.source === 'getsnykurl') {
    sendResponse({ url: snykurl });
  } else if (request.source === 'snykurl') {
    snykurl = request.url;

    var connectionTimeout = setTimeout(() => {
      sendResponse({ status: 'fail' });
      snykurl = 'snyk.io';
      return;
    }, 3000);

    fetch('https://'+snykurl +'/')
      .then(
        (response) => {
          if (response.status !== 200) {
            sendResponse({ status: 'fail' });
            snykurl = 'snyk.io';
            return;
          }
          // console.log("success");
          clearTimeout(connectionTimeout);
          snykurl = snykurl;
          sendResponse({ status: 'success' });

          return;

        }
      )
      .catch((err) => {
        console.log(err);
      // sendResponse({status: "fail"});
      });
    return true;

  } else {
    const badgeRequest = fetch(request.testPath + '/badge.svg');

    badgeRequest
      .then((response) => {
        return response.text();
      })
      .then((response) => {
        const parse = new DOMParser();
        const doc = parse.parseFromString(response, 'image/svg+xml');
        const nbOfVuln = parseInt(doc.querySelectorAll('text')[3].innerHTML, 10);

        if (nbOfVuln > 0) {
          showVulnNotification(request.packageName, request.packageVersion, nbOfVuln);
        } else if (nbOfVuln === 0) {
          showSafeNotification(request.packageName, request.packageVersion);
        }
      });
  }
});