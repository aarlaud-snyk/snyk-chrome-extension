/* global getBadge */
const parsedUrl = document.location.pathname.match(/([a-zA-Z0-9\-\_]+)\/([a-zA-Z0-9\-\_]+)\/*([a-zA-Z0-9\-\_\/]*)/);

if (parsedUrl && parsedUrl[1] && parsedUrl[2] && parsedUrl[3] === '') {
  const githubOwner = parsedUrl[1];
  const githubRepo = parsedUrl[2];
  const packageName = githubOwner + '/' + githubRepo;
  const testPath = `https://snyk.io/test/github/${packageName}`;

  chrome.runtime.sendMessage({
    source: 'github',
    packageName,
    testPath,
  }, () => {
    const $anchor = document.createElement('a');
    $anchor.setAttribute('href', `${testPath}`);
    $anchor.innerHTML = getBadge(testPath);

    document
      .querySelector('#readme article h1')
      .after($anchor);
  });
}
