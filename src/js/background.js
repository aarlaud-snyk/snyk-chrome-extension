var snykurl = 'snyk.io';
var apiToken = '';
var userOrgs = [];

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

const getUserOrgs = (snykHostname, apiToken) => {
  fetch('https://'+snykurl +'/api/v1/orgs',
    { headers: {
      'Content-type': 'application/json',
      'Authorization': 'token '+ apiToken,
    },
    })
    .then((response) => {
      return response.text();
    })
    .then(
      (response) => {
        const responseJSON = JSON.parse(response);
        for (var i=0; i<responseJSON.orgs.length; i++) {
          userOrgs.push({ id: responseJSON.orgs[i].id, name:responseJSON.orgs[i].name });
        }
        return;
      }
    )
    .catch((err) => {
      console.log(err);
    });
};
const showDepUsageCountInPage = (count, orgName) => {

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      message: 'dep-usage-in-org',
      orgName,
      count,
    });
  });


};

const getDependencyUsageInOrgs = (dependencyName, dependencyVersion, orgsArray) => {
  const orgData=orgsArray[0];
  fetch('https://'+snykurl +'/api/v1/org/'+orgData.id+'/dependencies',
    { method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'token '+ apiToken,
      },
      body: `{ "filters": { "dependencies": ["${dependencyName}@${dependencyVersion}"]}}`,
    })
    .then((response) => {
      return response.text();
    })
    .then(
      (response) => {
        var count = 0;
        const responseJSON = JSON.parse(response);
        if (responseJSON.results && responseJSON.results.length > 0) {
          count = responseJSON.results[0].projects.length;
          showDepUsageCountInPage(count, orgData.name);
        }
        return;
      }
    )
    .catch((err) => {
      console.log(err);
    });
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
    sendResponse({ url: snykurl, apiToken });
  } else if (request.source === 'snykurl') {
    snykurl = request.url || 'snyk.io';

    var connectionTimeout = setTimeout(() => {
      sendResponse({ status: 'Fail to connect to '+snykurl + '. Defaulting to snyk.io.' });
      snykurl = 'snyk.io';
      return;
    }, 3000);
    if (!request.url || !request.apiToken) {
      snykurl = 'snyk.io';
      apiToken = '';
      sendResponse({ ok: true, status: 'Cleared !' });
    } else {
      fetch('https://'+snykurl +'/api/v1/',
        { headers: {
          'Authorization': 'token '+ request.apiToken,
        },
        })
        .then(
          (response) => {
            if (response.status !== 200) {
              sendResponse({ ok: false, status: 'Fail to connect '+response.status });
              snykurl = 'snyk.io';
              return;
            }
            // console.log("success");
            clearTimeout(connectionTimeout);
            snykurl = snykurl;
            apiToken = request.apiToken;
            getUserOrgs(snykurl, apiToken);
            sendResponse({ ok: true, status: 'success' });
            return;

          }
        )
        .catch((err) => {
          console.log(err);
          sendResponse({ ok: false, status: 'fail' });
        });
    }
    return true;

  } else {
    var endpoint = 'https://us-central1-snyk-browser-extension.cloudfunctions.net/badge';
    var url = 'https://'+snykurl + request.testPath + '/badge.svg';
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        url,
      }),
    };

    if (snykurl !== 'snyk.io') {
      endpoint = url; // Endpoint is same as url in onprem scenarios
      options = {
        headers: {
          'access-control-allow-origin': '*',
        },
      };
    }
    const badgeRequest = fetch(endpoint, options);
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
    sendResponse({ 'snykHostname': 'https://'+snykurl });
    if (apiToken) {
      getDependencyUsageInOrgs('body-parser','1.9.0', userOrgs);
    }
  }
});
