document.addEventListener('DOMContentLoaded', function () {
  // --- Expand/collapse component details on click ---
  document.querySelectorAll('.component:not(.bundled):not(.na)').forEach(function (el) {
    el.addEventListener('click', function () {
      el.classList.toggle('expanded');
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.classList.toggle('expanded');
      }
    });
  });

  // --- Flavor dropdowns ---
  document.querySelectorAll('.flavor-select').forEach(function (select) {
    select.addEventListener('change', function () {
      var group = select.getAttribute('data-flavor-group');
      var selectedIndex = select.value;

      // Sync all dropdowns in this flavor group
      document.querySelectorAll('.flavor-select[data-flavor-group="' + group + '"]').forEach(function (s) {
        s.value = selectedIndex;
      });

      // Show selected flavor row, hide others
      document.querySelectorAll('.tier-row[data-flavor-group="' + group + '"]').forEach(function (row) {
        if (row.getAttribute('data-flavor-index') === selectedIndex) {
          row.classList.remove('flavor-hidden');
        } else {
          row.classList.add('flavor-hidden');
        }
      });
    });
  });

  // --- Use-case filter buttons ---
  var filterBtns = document.querySelectorAll('.filter-btn');
  var tierRows = document.querySelectorAll('.tier-row');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');

      tierRows.forEach(function (row) {
        if (filter === 'all') {
          row.classList.remove('hidden');
        } else {
          var useCases = row.getAttribute('data-use-cases') || '';
          if (useCases.split(',').indexOf(filter) !== -1) {
            row.classList.remove('hidden');
          } else {
            row.classList.add('hidden');
          }
        }
      });
    });
  });
});
