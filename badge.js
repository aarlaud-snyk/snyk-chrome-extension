
function getBadge(testPath) {
  return `<img
  src="${testPath}/badge.svg"
  alt="Known Vulnerabilities"
  data-canonical-src="${testPath}"
  style="max-width:100%;"/>`;
}
