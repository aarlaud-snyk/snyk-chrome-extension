var opened = true;

var toggleExpandCollapseTree = () => {
  for (var i=0; i<document.getElementsByClassName('tree__branch').length;i++) {
    if (opened) {
      document.getElementsByClassName('tree__branch')[i].setAttribute('open','open');
    } else {
      document.getElementsByClassName('tree__branch')[i].removeAttribute('open');
    }
  }
  opened = !opened;
};

var hideAllBranches = () => {
  const allBranches = document.getElementsByClassName('tree__branch');
  for (var j in allBranches) {
    if (allBranches[j].className && allBranches[j].className.indexOf('hidden') <0) {
      allBranches[j].className += ' hidden';
    }
  };
};

var getParents = function (elem, selector) {

  // Element.matches() polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			function(s) {
			  var matches = (this.document || this.ownerDocument).querySelectorAll(s),
			    i = matches.length;
			  while (--i >= 0 && matches.item(i) !== this) {}
			  return i > -1;
			};
  }

  // Set up a parent array
  var parents = [];

  // Push each parent element to the array
  for ( ; elem && elem !== document; elem = elem.parentNode ) {
    if (selector) {
      if (elem.matches(selector)) {
        parents.push(elem);
      }
      continue;
    }
    parents.push(elem);
  }

  // Return our parent array
  return parents;

};

var showAllBranches = () => {
  const allBranches = document.getElementsByClassName('tree__branch');
  for (var j in allBranches) {
    if (allBranches[j].className && allBranches[j].className.indexOf('hidden') >=0) {
      allBranches[j].classList.remove('hidden');
    }
  };
};

var showSearchedBranches = (element) => {
  var parents = getParents(element, '.tree__branch');
  parents.forEach((parent) => {
    var hasNonHiddenChild = false;
    for (var i=0; i<parent.childNodes.length;i++) {
      if (parent.childNodes[i].className && parent.childNodes[i].className.indexOf('tree__branch') >= 0
        && parent.childNodes[i].className.indexOf('hidden--sr') < 0) {
        hasNonHiddenChild = true;
        break;
      }
    }
    if (hasNonHiddenChild && parent.className && parent.className.indexOf('hidden--sr') < 0
        && parent.className.indexOf('hidden') >= 0) {
      parent.classList.remove('hidden');
    }
  });
  // element.classList.remove('hidden');
};

if (!document.getElementById('expandBtn')) {

  const li = document.createElement('li');
  li.setAttribute('class', 'filter__group__item');
  const btn = document.createElement('button');
  btn.setAttribute('id','expandBtn');
  li.appendChild(btn);
  const textBtn = document.createTextNode('Expand/Collapse');
  btn.onclick = () => {
    toggleExpandCollapseTree();
  };
  btn.appendChild(textBtn);
  document.getElementsByClassName('filter__group filter__group--sidebar--sm')[0].appendChild(li);
}

if (!document.getElementById('depSearchBar')) {
  const li = document.createElement('li');
  li.setAttribute('class', 'filter__group__item');
  const searchField = document.createElement('input');
  searchField.setAttribute('type', 'search');
  searchField.setAttribute('id', 'depSearchBar');
  searchField.onkeyup = () => {
    const searchTerm = searchField.value;
    if (searchTerm !== '') {
      hideAllBranches();
      for (var i=0; i<document.getElementsByTagName('a').length; i++) {
        document.getElementsByTagName('a')[i].style.color = '#4b45a1';
        if (document.getElementsByTagName('a')[i].textContent.indexOf(searchTerm)>=0) {
          // Checking to active only if the first tree--branch parent is not hidden
          if (document.getElementsByTagName('a')[i].parentElement.parentElement.className.indexOf('hidden--sr') < 0) {
            showSearchedBranches(document.getElementsByTagName('a')[i]);
            document.getElementsByTagName('a')[i].style.color = 'red';
          }
        }
      }
    } else {
      showAllBranches();
      for (var i=0; i<document.getElementsByTagName('a').length; i++) {
        document.getElementsByTagName('a')[i].style.color = '#4b45a1';
      }
    }

  };
  li.appendChild(searchField);
  document.getElementsByClassName('filter__group filter__group--sidebar--sm')[0].appendChild(li);
}
