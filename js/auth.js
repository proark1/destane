/* ============================================
   DESTANE - Auth UI Script
   Handles showing/hiding auth-aware elements
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  fetch('/api/me')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var guestEls = document.querySelectorAll('[data-auth="guest"]');
      var userEls = document.querySelectorAll('[data-auth="user"]');
      var usernameEls = document.querySelectorAll('[data-auth="username"]');
      var logoutBtns = document.querySelectorAll('[data-auth="logout"]');

      if (data.authenticated) {
        guestEls.forEach(function (el) { el.style.display = 'none'; });
        userEls.forEach(function (el) { el.style.display = ''; });
        usernameEls.forEach(function (el) { el.textContent = data.user.username; });
      } else {
        guestEls.forEach(function (el) { el.style.display = ''; });
        userEls.forEach(function (el) { el.style.display = 'none'; });
      }

      logoutBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var form = document.createElement('form');
          form.method = 'POST';
          form.action = '/auth/logout';
          document.body.appendChild(form);
          form.submit();
        });
      });
    })
    .catch(function () {
      // If fetch fails (e.g., opened as static file), show guest state
    });
});
