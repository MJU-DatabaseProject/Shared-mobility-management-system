const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql', 
    database: 'shared_mobility' 
  });
  
  db.connect((err) => {
    if (err) {
      throw err;
    }
    console.log('MySQL Connected...');
  });

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Body parser middleware
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));

// Use routes from routes/user.js
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes(db)); // Pass db connection to routes

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/user.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'user.html'));
});

app.get('/edit_user.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'edit_user.html'));
  });

// More HTML routes as needed
app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.get('/mobility.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'mobility.html'));
});

app.get('/station.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'station.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
