const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const uri = 'mongodb+srv://cluster0.xeoakzv.mongodb.net/'; //used username and password in shell 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

connectToMongoDB();

app.post('/saveGameResult', async (req, res) => {
  const { playerName, computerName, playerChoice, computerChoice, winner } = req.body;
  const db = client.db('mydb1'); // Replace 'mydb1' with your database name
  const gameResultsCollection = db.collection('game_results');

  try {
    await gameResultsCollection.insertOne({
      playerName,
      computerName,
      playerChoice,
      computerChoice,
      winner
    });
    console.log('Game result saved to MongoDB');
    res.status(201).json({ message: 'Game result saved successfully' });
  } catch (err) {
    console.error('Error saving game result to MongoDB:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/finalResults', async (req, res) => {
  try {
    const db = client.db('mydb1'); 
    const gameResultsCollection = db.collection('game_results');
    const results = await gameResultsCollection.find({}).toArray();
    
   
    res.status(200).json(results); 
  } catch (error) {
    console.error('Error fetching final results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/lastGameResult', async (req, res) => {
  try {
    const db = client.db('mydb1'); 
    const gameResultsCollection = db.collection('game_results');
    const lastResult = await gameResultsCollection.findOne({}, { sort: { _id: -1 } });
    res.status(200).json(lastResult);
  } catch (error) {
    console.error('Error fetching last game result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
