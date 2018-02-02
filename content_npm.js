



setTimeout(function(){
  var path = document.location.pathname;
  var packageName = path.replace("/package/","");
  var packageVersion = document.getElementsByClassName("last-publisher")[0].parentNode.childNodes[3].childNodes[1].textContent;
  //console.log(document.getElementsByClassName("last-publisher")[0].parentNode.childNodes[3].childNodes[1].textContent);

chrome.runtime.sendMessage({source: "npm", packageName: packageName, packageVersion: packageVersion}, function(response) {
  //console.log(response);
});}, 1000);
