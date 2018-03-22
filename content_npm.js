



setTimeout(function(){
  var path = document.location.pathname;
  var packageName = path.replace("/package/","");

  var elems = document.querySelectorAll("*"),
    res = Array.from(elems).find(v => v.textContent == 'version');
    var packageVersion = res.nextSibling.textContent;
  //var packageVersion = document.getElementsByClassName("last-publisher")[0].parentNode.childNodes[3].childNodes[1].textContent;
  //console.log(document.getElementsByClassName("last-publisher")[0].parentNode.childNodes[3].childNodes[1].textContent);

chrome.runtime.sendMessage({source: "npm", packageName: packageName, packageVersion: packageVersion}, function(response) {
  document.getElementById("readme").parentNode.insertBefore(getBadge(response.nbOfVuln, response.url, packageName, packageVersion), document.getElementById("readme"));
});}, 50);


var eElement; // some E DOM instance
var newFirstElement; //element which should be first in E
