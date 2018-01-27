



setTimeout(function(){
  //console.log(document.location.pathname);
// TODO:catch npm vs github here
  var path = document.location.pathname;
  var packageName = path.replace("/package/","");

chrome.runtime.sendMessage({source: "npm", packageName: packageName}, function(response) {
  //console.log(response);
});}, 500);
