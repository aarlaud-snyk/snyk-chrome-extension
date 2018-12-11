const packageName = document.location.pathname.split('/package/')[1];
const $readme = document.getElementById('readme');
const $anchor = document.createElement('a');
const testPath = `/test/npm/${packageName}`;

$anchor.setAttribute('href', testPath);
$anchor.innerHTML = `<div class="m-2"><img
src="${testPath}/badge.svg"
alt="Known Vulnerabilities"
data-canonical-src="${testPath}"
style="max-width:100%;"/></div>`;

$readme.parentNode.insertBefore($anchor, $readme);
