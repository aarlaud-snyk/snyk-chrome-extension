const packageName = document.location.pathname.split('/package/')[1];
const $readme = document.getElementById("readme");
const $anchor = document.createElement('a');

$anchor.setAttribute('href', `https://snyk.io/test/npm/${packageName}`);
$anchor.innerHTML = `<div class="m-2"><img
src="https://snyk.io/test/npm/${packageName}/badge.svg"
alt="Known Vulnerabilities"
data-canonical-src="https://snyk.io/test/npm/${packageName}"
style="max-width:100%;"/></div>`;

$readme.parentNode.insertBefore($anchor, $readme);
