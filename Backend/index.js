require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.post('/saveGameResult', (req, res) => {
  const { playerName, computerName, playerChoice, computerChoice, winner } = req.body;

  const queryString = `INSERT INTO game_results (playerName, computerName, playerChoice, computerChoice, winner) 
                       VALUES (?, ?, ?, ?, ?)`;
  const values = [playerName, computerName, playerChoice, computerChoice, winner];

  connection.query(queryString, values, (err, result) => {
    if (err) {
      console.error('Error saving game result to MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Game result saved to MySQL');
    res.status(201).json({ message: 'Game result saved successfully' });
  });
});

app.get('/finalResults', (req, res) => {
  const queryString = 'SELECT * FROM game_results';

  connection.query(queryString, (err, results) => {
    if (err) {
      console.error('Error fetching final results from MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Final results fetched from MySQL');
    res.status(200).json(results);
  });
});

app.get('/lastGameResult', (req, res) => {
  const queryString = 'SELECT * FROM game_results ORDER BY id DESC LIMIT 1';

  connection.query(queryString, (err, result) => {
    if (err) {
      console.error('Error fetching last game result from MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Last game result fetched from MySQL');
    res.status(200).json(result[0]);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
