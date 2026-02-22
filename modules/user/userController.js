const bcrypt = require('bcryptjs');
const User = require('./userModel');

class UserController {
  // List all users
  async list(req, res) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt'],
        order: [['createdAt', 'DESC']]
      });

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({ success: true, users });
      }

      res.render('user/users', { users, currentUserId: req.session.userId });
    } catch (error) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(500).json({ success: false, error: error.message });
      }
      req.flash('error', 'Error loading users');
      res.redirect('/dashboard');
    }
  }

  // Show edit user page
  async showEdit(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: ['id', 'username', 'email']
      });

      if (!user) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(404).json({ success: false, error: 'User not found' });
        }
        req.flash('error', 'User not found');
        return res.redirect('/users');
      }

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({ success: true, user });
      }

      res.render('user/edit-user', { user });
    } catch (error) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(500).json({ success: false, error: error.message });
      }
      req.flash('error', 'Error loading user');
      res.redirect('/users');
    }
  }

  // Update user
  async update(req, res) {
    try {
      const { username, email } = req.body;
      const user = await User.findByPk(req.params.id);

      if (!user) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          return res.status(404).json({ success: false, error: 'User not found' });
        }
        req.flash('error', 'User not found');
        return res.redirect('/users');
      }

      await user.update({ username, email });

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({ 
          success: true, 
          message: 'User updated successfully',
          user: { id: user.id, username: user.username, email: user.email }
        });
      }

      req.flash('success', 'User updated successfully');
      res.redirect('/users');
    } catch (error) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(400).json({ success: false, error: error.message });
      }
      req.flash('error', error.message);
      res.redirect('/users/' + req.params.id + '/edit');
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      // Only allow users to change their own password
      if (req.session.userId !== user.id) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }

      if (!await bcrypt.compare(currentPassword, user.password)) {
        return res.status(400).json({ success: false, error: 'Current password is incorrect' });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, error: 'Passwords do not match' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });

      res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Delete user
  async delete(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      // Prevent deleting yourself
      if (req.session.userId === user.id) {
        return res.status(400).json({ success: false, error: 'Cannot delete your own account' });
      }

      await user.destroy();

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({ success: true, message: 'User deleted successfully' });
      }

      req.flash('success', 'User deleted successfully');
      res.redirect('/users');
    } catch (error) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(500).json({ success: false, error: error.message });
      }
      req.flash('error', error.message);
      res.redirect('/users');
    }
  }
}

module.exports = new UserController();

