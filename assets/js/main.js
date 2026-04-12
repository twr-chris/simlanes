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

});
