const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get users with pagination
  router.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) AS count FROM users';
    const query = 'SELECT user_id, user_name, user_join_date FROM users LIMIT ? OFFSET ?';

    db.query(countQuery, (countErr, countResults) => {
      if (countErr) {
        return res.status(500).json({ error: countErr.message });
      }

      const totalUsers = countResults[0].count;
      const totalPages = Math.ceil(totalUsers / limit);

      db.query(query, [limit, offset], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ users: results, totalPages });
      });
    });
  });

  // Search users by name
  router.get('/search/:name', (req, res) => {
    const name = req.params.name;
    const query = 'SELECT user_id, user_name, user_join_date FROM users WHERE user_name LIKE ?';
    db.query(query, [`%${name}%`], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

  // Get user by ID
  router.get('/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM users WHERE user_id = ?';
    db.query(query, [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(result[0]);
    });
  });

  // Update user by ID
  router.put('/:id', (req, res) => {
    const userId = req.params.id;
    let { user_name, user_birth, user_tel, rent_right, user_state, withdraw_date } = req.body;
  
    console.log('Received update for user ID:', userId);
    console.log('Update data:', req.body);
  
    // Convert empty withdraw_date to NULL
    if (withdraw_date === '') {
      withdraw_date = null;
    }
  
    const query = 'UPDATE users SET user_name = ?, user_birth = ?, user_tel = ?, rent_right = ?, user_state = ?, withdraw_date = ? WHERE user_id = ?';
    
    db.query(query, [user_name, user_birth, user_tel, rent_right, user_state, withdraw_date, userId], (err, result) => {
      if (err) {
        console.error('Database update error:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log('Database update result:', result);
      res.json({ message: 'User updated', result });
    });
  });
  
  

  // Delete user by ID
  router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'DELETE FROM users WHERE user_id = ?';
    db.query(query, [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'User deleted' });
    });
  });

  return router;
};
