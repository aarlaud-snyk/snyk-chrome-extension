

//console.log(document.location.pathname);
// do a filter using regexes to catch only packages and not issue pages or other things...
var parsedUrl = document.location.pathname.match(/([a-zA-Z0-9\-\_]+)\/([a-zA-Z0-9\-\_]+)\/*([a-zA-Z0-9\-\_\/]*)/);
var githubOrganization = "";
var githubRepo = "";
var packageVersion = "";
var packageName = "";
if(parsedUrl && parsedUrl[1] && parsedUrl[2] && parsedUrl[3] == ""){
  githubOrganization = parsedUrl[1];
  githubRepo = parsedUrl[2];
  packageName = githubOrganization+"/"+githubRepo;

  setTimeout(function(){
    chrome.runtime.sendMessage({source: "github", packageName: packageName, packageVersion: packageVersion}, function(response) {
      document.querySelector("#readme > article > h1").insertAdjacentHTML("afterEnd",getBadge(response.nbOfVuln, response.url, packageName, packageVersion).innerHTML);
    });
  }, 50);


}
