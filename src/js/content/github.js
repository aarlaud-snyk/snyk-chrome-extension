/* global getBadge */
const parsedUrl = document.location.pathname.match(/([a-zA-Z0-9\-\_]+)\/([a-zA-Z0-9\-\_]+)\/*([a-zA-Z0-9\-\_\/]*)/);

if (parsedUrl && parsedUrl[1] && parsedUrl[2] && parsedUrl[3] === '') {
  const githubOwner = parsedUrl[1];
  const githubRepo = parsedUrl[2];
  const packageName = githubOwner + '/' + githubRepo;
  const testPath = `/test/github/${packageName}`;

  chrome.runtime.sendMessage({
    source: 'github',
    packageName,
    testPath,
  }, (data) => {
    const $anchor = document.createElement('a');
    $anchor.setAttribute('href', data.snykHostname+`${testPath}`);
    $anchor.innerHTML = getBadge(data.snykHostname+testPath);

    document
      .querySelector('#readme article h1')
      .after($anchor);
  });
}
