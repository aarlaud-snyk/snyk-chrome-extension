const snykurl = 'snyk.io';

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

const isValidNpmPackagePage = (str) => {
  const pattern = new RegExp(/^https:\/\/www.npmjs.com\/package\//);
  return pattern.test(str);
};

const isValidSnykDepTreePage = (str) => {
  const pattern = new RegExp(/^https:\/\/app.snyk.io\/.+\/project\/.+\?.*tab=dependencies/);
  return pattern.test(str);
};

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading' && isValidNpmPackagePage(changeInfo.url)) {
    chrome.tabs.sendMessage(tabId, {
      message: 'npm-client-side-navigation',
      url: changeInfo.url,
    });
  }
  if (changeInfo.status === 'loading' && isValidSnykDepTreePage(changeInfo.url)) {
    chrome.tabs.sendMessage(tabId, {
      message: 'snyk-client-side-navigation',
      url: changeInfo.url,
    });
  }
});

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
    const badgeRequest = fetch('https://us-central1-snyk-browser-extension.cloudfunctions.net/badge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        url: request.testPath + '/badge.svg',
      }),
    });

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
