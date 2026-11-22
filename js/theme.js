(function () {
  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  var preference = null;

  try {
    var saved = localStorage.getItem('irem-theme');
    if (saved === 'light' || saved === 'dark') {
      preference = saved;
    }
  } catch (error) {
    // Fall back to the device preference if browser storage is unavailable.
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('.theme-toggle').forEach(function (button) {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    });
  }

  // Run before styles load to avoid flashing the wrong theme on navigation.
  applyTheme(preference || (systemTheme.matches ? 'dark' : 'light'));

  systemTheme.addEventListener('change', function (event) {
    if (!preference) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(document.documentElement.dataset.theme);
    document.querySelectorAll('.theme-toggle').forEach(function (button) {
      button.addEventListener('click', function () {
        preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(preference);
        try {
          localStorage.setItem('irem-theme', preference);
        } catch (error) {
          // The toggle remains usable without persistence.
        }
      });
    });
  });
})();
