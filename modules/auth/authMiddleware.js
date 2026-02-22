const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  
  // Check if it's an API request
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  
  req.flash('error', 'Please login to access this page');
  res.redirect('/login');
};

const isGuest = (req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  res.redirect('/dashboard');
};

module.exports = { isAuthenticated, isGuest };

