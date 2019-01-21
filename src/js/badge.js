/* eslint no-unused-vars:0 */
function getBadge(testUrl) {
  return `<img
    id="snyk-badge"
    src="${testUrl}/badge.svg"
    alt="Known Vulnerabilities"
    data-canonical-src="${testUrl}"
    style="max-width:100%;"/>`;
}
