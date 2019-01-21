/* global getBadge */
function processNpmPackage() {
  const packageName = document.location.pathname.split('/')[2];
  const packageVersion = document.location.pathname.split('/')[4] || 'latest';
  const testPath = `/test/npm/${packageName}/${packageVersion}`;

  chrome.runtime.sendMessage({
    source: 'npm',
    packageName,
    packageVersion,
    testPath,
  }, (data) => {
    const $anchor = document.createElement('a');
    const $headingElement = document.querySelector('#readme h1') || document.querySelector('#readme > *:first-child');
    $anchor.setAttribute('href', data.snykHostname+`${testPath}`);
    $anchor.innerHTML = getBadge(data.snykHostname+testPath);

    $headingElement
      .after($anchor);
  });
}

processNpmPackage();

chrome.runtime.onMessage.addListener((data) => {
  if (data.message && data.message === 'npm-client-side-navigation') {
    processNpmPackage();
  }
  if (data.message && data.message === 'dep-usage-in-org') {
    const $anchor = document.createElement('div');
    const $badgeElement = document.querySelector('#snyk-badge').parentNode;
    $anchor.setAttribute('id', 'depSnykCountInOrg');
    $anchor.innerHTML = 'Used in ' + data.count + ' projects in your ' + data.orgName + ' organization';

    $badgeElement
      .after($anchor);
  }
});
