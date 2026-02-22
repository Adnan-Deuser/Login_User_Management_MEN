const bcrypt = require('bcryptjs');
const User = require('../user/userModel');

class AuthController {
  // Show register page
  showRegister(req, res) {
    res.render('auth/register');
  }

  // Show login page
  showLogin(req, res) {
    res.render('auth/login');
  }

  // Handle registration
  async register(req, res) {
    try {
      const { username, email, password, confirmPassword } = req.body;

      // Validation
      if (!username || !email || !password || !confirmPassword) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(400).json({ success: false, error: 'All fields are required' });
        }
        req.flash('error', 'All fields are required');
        return res.redirect('/register');
      }

      if (password !== confirmPassword) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(400).json({ success: false, error: 'Passwords do not match' });
        }
        req.flash('error', 'Passwords do not match');
        return res.redirect('/register');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await User.create({
        username,
        email,
        password: hashedPassword
      });

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({ 
          success: true, 
          message: 'Registration successful',
          user: { id: user.id, username: user.username, email: user.email }
        });
      }

      req.flash('success', 'Registration successful! Please login.');
      res.redirect('/login');
    } catch (error) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(400).json({ success: false, error: error.message });
      }
      req.flash('error', error.message);
      res.redirect('/register');
    }
  }

  // Handle login
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(400).json({ success: false, error: 'All fields are required' });
        }
        req.flash('error', 'All fields are required');
        return res.redirect('/login');
      }

      const user = await User.findOne({ where: { username } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        req.flash('error', 'Invalid username or password');
        return res.redirect('/login');
      }

      req.session.userId = user.id;

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({ 
          success: true, 
          message: 'Login successful',
          user: { id: user.id, username: user.username, email: user.email }
        });
      }

      req.flash('success', 'Welcome back, ' + user.username + '!');
      res.redirect('/dashboard');
    } catch (error) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(500).json({ success: false, error: error.message });
      }
      req.flash('error', 'An error occurred');
      res.redirect('/login');
    }
  }

  // Handle logout
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(500).json({ success: false, error: 'Logout failed' });
        }
        req.flash('error', 'Logout failed');
        return res.redirect('/dashboard');
      }

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({ success: true, message: 'Logout successful' });
      }

      res.redirect('/login');
    });
  }

  // Show dashboard
  async showDashboard(req, res) {
    try {
      const user = await User.findByPk(req.session.userId, {
        attributes: ['id', 'username', 'email', 'createdAt']
      });

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({ success: true, user });
      }

      res.render('user/dashboard', { user });
    } catch (error) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(500).json({ success: false, error: error.message });
      }
      req.flash('error', 'Error loading dashboard');
      res.redirect('/login');
    }
  }
}

module.exports = new AuthController();

