require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 1. Allow the server to read JSON data from the frontend
app.use(express.json());

// 2. Database Connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
});

connection.connect((err) => {
  if (err) return console.error('TiDB Connection Failed: ' + err.message);
  console.log('Connected to TiDB Cloud!');
});

// 3. Serve all files in the folder (This lets image.jpg work!)
app.use(express.static(__dirname));

// 4. ROUTE: Save message to Database
app.post('/api/message', (req, res) => {
  const { name, message } = req.body;
  const sql = 'INSERT INTO users (name, bio) VALUES (?, ?)';
  
  connection.query(sql, [name, message], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send('Message Saved!');
  });
});

// 5. ROUTE: Show the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});