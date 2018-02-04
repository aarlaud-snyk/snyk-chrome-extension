
function getBadge(nbOfVuln, url, packageName,packageVersion) {
  var color = nbOfVuln > 0 ? "#e05d44":"#4c1";

  var badge = document.createElement("a");
  badge.innerHTML = `
  <a target="_new" href="${url}">
    <svg id="snyk-badge" data-package="${packageName}@${packageVersion}" xmlns="http://www.w3.org/2000/svg" width="110" height="20">
      <linearGradient id="b" x2="0" y2="100%">
        <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
        <stop offset="1" stop-opacity=".1"/>
      </linearGradient>
      <mask id="a">
        <rect width="110" height="20" rx="3" fill="#fff"/>
      </mask>
      <g mask="url(#a)">
        <path fill="#555" d="M0 0h90v20H0z"/>
        <path fill=${color} d="M90 0h110v20H90z"/>
        <path fill="url(#b)" d="M0 0h110v20H0z"/>
      </g>
      <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
        <text x="45" y="15" fill="#010101" fill-opacity=".3">vulnerabilities</text>
        <text x="45" y="14">vulnerabilities</text>
        <text x="100" y="15" fill="#010101" fill-opacity=".3">${nbOfVuln}</text>
        <text x="100" y="14">${nbOfVuln}</text>
      </g>
    </svg>
  </a>
  `
  return badge;
}
