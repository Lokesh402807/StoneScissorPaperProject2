import React, { useState } from "react";
import "./App.css";

const choices = ["Stone", "Paper", "Scissors"];

function App() {
  const [playerName, setPlayerName] = useState("");
  const [computerName, setComputerName] = useState("Computer");
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [currentPage, setCurrentPage] = useState("nameEntry");
  const [finalResults, setFinalResults] = useState([]);
  const [lastGameResult, setLastGameResult] = useState(null);

  const generateComputerChoice = () => {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  };

  const determineWinner = (player, computer) => {
    if (player === computer) {
      return "Tie";
    } else if (
      (player === "Stone" && computer === "Scissors") ||
      (player === "Paper" && computer === "Stone") ||
      (player === "Scissors" && computer === "Paper")
    ) {
      return "Player";
    } else {
      return "Computer";
    }
  };

  const handleStartGame = () => {
    if (playerName.trim().length > 0 && computerName.trim().length > 0) {
      setCurrentPage("game");
    } else {
      alert("Please enter names for both players.");
    }
  };

  const saveGameResult = async () => {
    try {
      const response = await fetch('https://stone-scissor-paper-project21.vercel.app/saveGameResult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerName,
          computerName,
          playerChoice,
          computerChoice,
          winner: playerWins > computerWins ? playerName : computerName
        })
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  };

  const playRound = (choice) => {
    const computerChoice = generateComputerChoice();
    const winner = determineWinner(choice, computerChoice);
    setPlayerChoice(choice);
    setComputerChoice(computerChoice);
    setRoundsPlayed(roundsPlayed + 1);

    if (winner === "Player") {
      setPlayerWins(playerWins + 1);
    } else if (winner === "Computer") {
      setComputerWins(computerWins + 1);
    }

    if (roundsPlayed === 5) {
      saveGameResult();
      setCurrentPage("endGame");
    }
  };

  const restartGame = () => {
    setPlayerName("");
    setComputerName("Computer");
    setPlayerChoice(null);
    setComputerChoice(null);
    setPlayerWins(0);
    setComputerWins(0);
    setRoundsPlayed(0);
    setCurrentPage("nameEntry");
  };

  const fetchFinalResults = async () => {
    try {
      const response = await fetch('https://stone-scissor-paper-project21.vercel.app/finalResults');
      const data = await response.json();
      setFinalResults(data);
    } catch (error) {
      console.error('Error fetching final results:', error);
      setFinalResults([]);
    }
  };

  const fetchLastGameResult = async () => {
    try {
      const response = await fetch('https://stone-scissor-paper-project21.vercel.app/lastGameResult');
      const data = await response.json();
      setLastGameResult(data);
    } catch (error) {
      console.error('Error fetching last game result:', error);
    }
  };

  const determineGameWinner = () => {
    if (playerWins > computerWins) {
      return playerName;
    } else if (computerWins > playerWins) {
      return computerName;
    } else {
      return "Tie";
    }
  };

  return (
    <div className="App">
      {currentPage === "nameEntry" && (
        <div className="NameEntryPage">
          <h1>Enter Names</h1>
          <label>Player 1 Name:</label>
          <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
          <label>Player 2 Name:</label>
          <input type="text" value={computerName} onChange={(e) => setComputerName(e.target.value)} />
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      )}
      {currentPage === "game" && (
        <div className="GamePage">
          <h1>Stone Paper Scissors</h1>
          <p>Round {roundsPlayed + 1} of 6</p>
          <div className="Game">
            <div className="Player">
              <p>{playerName}</p>
              {choices.map((choice) => (
                <button key={choice} onClick={() => playRound(choice)}>{choice}</button>
              ))}
            </div>
            <div className="Computer">
              <p>{computerName}</p>
              {computerChoice && <p>{computerChoice}</p>}
            </div>
          </div>
          {roundsPlayed > 0 && (
            <div className="Score">
              <p>{playerName} Wins: {playerWins}</p>
              <p>{computerName} Wins: {computerWins}</p>
            </div>
          )}
        </div>
      )}
      {currentPage === "endGame" && (
        <div className="EndGamePage">
          <h1>Game Over!</h1>
          <p>Final Results:</p>
          <ul>
            {Array.isArray(finalResults) && finalResults.map((result, index) => (
              <li key={index}>{result.playerName} vs {result.computerName}: {result.winner}</li>
            ))}
          </ul>
          <p>Overall Winner: {determineGameWinner()}</p>
          <button onClick={restartGame}>Return Home</button>
          <button onClick={fetchFinalResults}>Show Final Results</button>
          <button onClick={fetchLastGameResult}>Show Last Game Result</button>
          {lastGameResult && (
            <div>
              <p>Last Game Result:</p>
              <p>{lastGameResult.playerName} vs {lastGameResult.computerName}: {lastGameResult.winner}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
