/* global getBadge */
var packageName = document.location.pathname.split('/')[2];
var packageVersion = document.location.pathname.split('/')[4] || 'latest';
var testPath = `https://snyk.io/test/npm/${packageName}/${packageVersion}`;

chrome.runtime.sendMessage({
  source: 'npm',
  packageName,
  packageVersion,
  testPath,
}, () => {
  const $anchor = document.createElement('a');
  $anchor.setAttribute('href', `${testPath}`);
  $anchor.innerHTML = getBadge(testPath);

  document
    .querySelector('#readme h1')
    .after($anchor);
});
