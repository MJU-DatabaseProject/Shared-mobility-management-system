const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Get shared_mo records with pagination
  router.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) AS count FROM shared_mo';
    const query = 'SELECT mo_id, model, stat_id, IFNULL(batt, "N/A") AS batt, broken_yn FROM shared_mo LIMIT ? OFFSET ?';

    db.query(countQuery, (countErr, countResults) => {
      if (countErr) {
        return res.status(500).json({ error: countErr.message });
      }

      const totalRecords = countResults[0].count;
      const totalPages = Math.ceil(totalRecords / limit);

      db.query(query, [limit, offset], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ records: results, totalPages });
      });
    });
  });

  // Search shared_mo by mo_id
  router.get('/search/:id', (req, res) => {
    const moId = req.params.id;
    const query = 'SELECT mo_id, model, stat_id, IFNULL(batt, "N/A") AS batt, broken_yn FROM shared_mo WHERE mo_id LIKE ?';
    db.query(query, [`%${moId}%`], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

  // Get shared_mo record by ID
  router.get('/:id', (req, res) => {
    const moId = req.params.id;
    const query = 'SELECT * FROM shared_mo WHERE mo_id = ?';
    db.query(query, [moId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(result[0]);
    });
  });

  // Update broken_yn and last_main_date by ID
  router.put('/:id', (req, res) => {
    const moId = req.params.id;
    const { broken_yn, last_main_date } = req.body;
  
    console.log('Received update for record ID:', moId);
    console.log('Update data:', req.body);
  
    const query = 'UPDATE shared_mo SET broken_yn = ?, last_main_date = ? WHERE mo_id = ?';
    
    db.query(query, [broken_yn, last_main_date, moId], (err, result) => {
      if (err) {
        console.error('Database update error:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log('Database update result:', result);
      res.json({ message: 'Record updated', result });
    });
  });
  
  // Add new shared_mo record
  router.post('/', (req, res) => {
    const { mo_id, model, stat_id, batt, broken_yn } = req.body;
    const query = 'INSERT INTO shared_mo (mo_id, model, stat_id, batt, broken_yn) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [mo_id, model, stat_id, batt, broken_yn], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Record added', result });
    });
  });

  // Add new mobility
  router.post('/', (req, res) => {
    const { mo_id, model, stat_id, location_id, manu_date, batt, mo_type, broken_yn, last_main_date } = req.body;
    const query = 'INSERT INTO shared_mo (mo_id, model, stat_id, location_id, manu_date, batt, mo_type, broken_yn, last_main_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [mo_id, model, stat_id, location_id, manu_date, batt, mo_type, broken_yn, last_main_date], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Mobility added', result });
    });
  });

  // Delete shared_mo record by ID
  router.delete('/:id', (req, res) => {
    const moId = req.params.id;
    const query = 'DELETE FROM shared_mo WHERE mo_id = ?';
    db.query(query, [moId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Record deleted' });
    });
  });

  return router;
};
