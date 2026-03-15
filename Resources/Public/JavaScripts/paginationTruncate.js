(function () {
  'use strict';

  var EDGE = 1;
  var WINDOW = 1;
  var MIN_TO_TRUNCATE = 6;

  function truncate(list) {
    var pages = [];

    Array.prototype.forEach.call(list.children, function (li) {
      if (li.classList.contains('tx-indexedsearch-page')) {
        pages.push(li);
      }
    });

    var total = pages.length;
    if (total < MIN_TO_TRUNCATE) return;

    var currentIdx = -1;
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].querySelector('[aria-current="page"]')) {
        currentIdx = i;
        break;
      }
    }
    if (currentIdx === -1) return;

    var visible = [];
    for (var j = 0; j < total; j++) {
      var isEdgeStart = j < EDGE;
      var isEdgeEnd = j >= total - EDGE;
      var isInWindow = Math.abs(j - currentIdx) <= WINDOW;
      visible.push(isEdgeStart || isEdgeEnd || isInWindow);
    }

    var lastVisible = true;
    for (var k = 0; k < total; k++) {
      if (visible[k]) {
        lastVisible = true;
      } else {
        if (lastVisible) {
          var ellipsis = document.createElement('li');
          ellipsis.className = 'tx-indexedsearch-ellipsis';
          ellipsis.setAttribute('aria-hidden', 'true');
          ellipsis.innerHTML = '<span>\u2026</span>';
          pages[k].parentNode.insertBefore(ellipsis, pages[k]);
        }
        pages[k].style.display = 'none';
        lastVisible = false;
      }
    }
  }

  function init() {
    var lists = document.querySelectorAll('ul.tx-indexedsearch-browsebox');
    for (var i = 0; i < lists.length; i++) {
      truncate(lists[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
