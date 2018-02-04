



setTimeout(function(){
  var path = document.location.pathname;
  var packageName = path.replace("/package/","");
  var packageVersion = document.getElementsByClassName("last-publisher")[0].parentNode.childNodes[3].childNodes[1].textContent;
  //console.log(document.getElementsByClassName("last-publisher")[0].parentNode.childNodes[3].childNodes[1].textContent);

chrome.runtime.sendMessage({source: "npm", packageName: packageName, packageVersion: packageVersion}, function(response) {
  document.getElementsByClassName("package-name")[0].appendChild(getBadge(response.nbOfVuln, response.url, packageName, packageVersion));
});}, 50);
