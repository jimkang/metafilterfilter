((function filterMetaFilter() {
  NodeList.prototype.forEach = function nodeListEach(callback, thisArg) {
    for (var i = 0; i < this.length; ++i) {
      var value = this[i];
      if (thisArg) {
        callback.bind(thisArg)(value, i, this);
      }
      else {
        callback(value, i, this);
      }
    }
  };

  function addFilterButtons() {
    document.querySelectorAll('.post').forEach(addFilterButton);
  }

  function addFilterButton(postEl) {
    var filterSpan = document.createElement('span');
    var filterLink = document.createElement('a');
    filterSpan.classList.add('smallcopy');
    filterLink.classList.add('filter-link');
    filterLink.innerHTML = '&#215;';

    filterLink.addEventListener('click', markPostAsFiltered); 

    filterSpan.appendChild(filterLink);
    postEl.appendChild(filterSpan);
  }

  function markPostAsFiltered(e) {
    // BIG ASSUMPTIONS here about the structure of the post div.
    var postEl = e.currentTarget.parentElement.parentElement;
    var postChildCount = postEl.childNodes.length;
    if (postChildCount > 2) {
      var bottomStripEl = postEl.childNodes[postChildCount - 2];
      var stripChildCount = bottomStripEl.childNodes.length;
      if (stripChildCount > 2) {
        var favSpan = bottomStripEl.childNodes[stripChildCount - 2];
        // If the user is not logged in, there will be no favSpan.
        if (favSpan.id) {
          storeId(favSpan.id)
        }
      }
    }

    destroyEl(postEl);
  }

  function getIdArrayFromLocalStorage() {
    var idArrayString = localStorage.filteredIds;
    var ids;
    if (idArrayString) {
      ids = JSON.parse(localStorage.filteredIds);
      ids = ids.filter(function isNotEmpty(id) { return (id); });      
    }
    else {
      ids = [];      
    }
    return ids;    
  }

  function storeId(id) {
    var ids = getIdArrayFromLocalStorage();
    ids.push(id);

    localStorage.filteredIds = JSON.stringify(ids);
    return id;
  }

  function filterPosts() {
    var filteredIds = getIdArrayFromLocalStorage();
    filteredIds.forEach(killPostForFavId)
  }

  function killPostForFavId(id) {
    console.log('MetaFilterFilter is filtering', id, 'from MetaFilter');
    var favSpan = document.querySelector('#' + id);
    if (favSpan) {
      destroyEl(favSpan.parentElement.parentElement);
    }
  }

  function destroyEl(el) {
    el.parentElement.removeChild(el);
  }

  try {
    filterPosts();
  }
  catch (e) {
    console.log('MFF hit an error while filtering posts:', e);
  }

  try {
    addFilterButtons();
  }
  catch (e) {
    console.log('MFF hit an error while adding buttons:', e);
  }

})());
