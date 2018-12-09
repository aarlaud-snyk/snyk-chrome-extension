/* global getBadge */
function processNpmPackage() {
  const packageName = document.location.pathname.split('/')[2];
  const packageVersion = document.location.pathname.split('/')[4] || 'latest';
  const testPath = `https://snyk.io/test/npm/${packageName}/${packageVersion}`;

  chrome.runtime.sendMessage({
    source: 'npm',
    packageName,
    packageVersion,
    testPath,
  }, () => {
    const $anchor = document.createElement('a');
    const $headingElement = document.querySelector('#readme h1') || document.querySelector('#readme > *:first-child');
    $anchor.setAttribute('href', `${testPath}`);
    $anchor.innerHTML = getBadge(testPath);

    $headingElement
      .after($anchor);
  });
}

processNpmPackage();

chrome.runtime.onMessage.addListener((data) => {
  if (data.message && data.message === 'client-side-navigation') {
    processNpmPackage();
  }
});
