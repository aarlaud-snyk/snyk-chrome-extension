const packageName = document.location.pathname.split('/')[2];
const packageVersion = document.location.pathname.split('/')[4] || 'latest';
const testPath = `https://snyk.io/test/npm/${packageName}/${packageVersion}`;

chrome.runtime.sendMessage({
  source: "npm",
  packageName,
  packageVersion,
  testPath,
},
function(response) {
  const $anchor = document.createElement('a');
  $anchor.setAttribute('href', `${testPath}`);
  $anchor.innerHTML = getBadge(testPath);

  document
    .querySelector('#readme h1')
    .after($anchor);
});
