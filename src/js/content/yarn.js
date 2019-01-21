const packageName = document.location.pathname.split('/package/')[1];
const $readme = document.getElementById('readme');
const $anchor = document.createElement('a');
const testPath = `/test/npm/${packageName}`;



chrome.runtime.sendMessage({
  source: 'yarn',
  packageName,
  testPath,
}, (data) => {
  $anchor.setAttribute('href', data.snykHostname + testPath);
  $anchor.innerHTML = `<div class="m-2"><img
src="${data.snykHostname}${testPath}/badge.svg"
alt="Known Vulnerabilities"
data-canonical-src="${testPath}"
style="max-width:100%;"/></div>`;

  $readme.parentNode.insertBefore($anchor, $readme);
});
