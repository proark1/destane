const protectedPages = [
  '/investor_dashboard.html',
  '/producer_portal.html',
  '/admin_control_panel.html',
  '/advanced_analytics_dashboard.html',
  '/my_productions_management.html',
  '/user_platform_settings.html',
];

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.redirect('/login.html');
}

function gateProtectedPages(req, res, next) {
  if (protectedPages.includes(req.path)) {
    return requireAuth(req, res, next);
  }
  next();
}

module.exports = { requireAuth, gateProtectedPages };
