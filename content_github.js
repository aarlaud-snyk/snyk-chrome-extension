

//console.log(document.location.pathname);
// do a filter using regexes to catch only packages and not issue pages or other things...
var parsedUrl = document.location.pathname.match(/([a-zA-Z0-9\-\_]+)\/([a-zA-Z0-9\-\_]+)\/*([a-zA-Z0-9\-\_\/]*)/);
var githubOrganization = "";
var githubRepo = "";
var packageVersion = "";
if(parsedUrl && parsedUrl[1] && parsedUrl[2] && parsedUrl[3] == ""){
  githubOrganization = parsedUrl[1];
  githubRepo = parsedUrl[2];


  setTimeout(function(){
    chrome.runtime.sendMessage({source: "github", packageName: githubOrganization+"/"+githubRepo, packageVersion: packageVersion}, function(response) {
      //console.log(response);
    });
  }, 1000);


}
