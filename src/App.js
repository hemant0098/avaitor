import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [multiplier, setMultiplier] = useState(1.00);
  const [crashPoint, setCrashPoint] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isCashedOut, setIsCashedOut] = useState(false);
  const [message, setMessage] = useState('');
  const intervalRef = useRef(null);

  // 🔁 Generate a random crash point
  const generateCrashPoint = () => {
    const fairness = Math.random();
    if (fairness < 0.03) return 1.00; // 3% chance instant crash
    return +(Math.random() * 10 + 1).toFixed(2); // Between 1.00x to 11.00x
  };

  const startGame = () => {
    const crash = generateCrashPoint();
    setCrashPoint(crash);
    setMultiplier(1.00);
    setIsRunning(true);
    setIsCashedOut(false);
    setMessage('');
    
    intervalRef.current = setInterval(() => {
      setMultiplier(prev => {
        const next = +(prev + 0.01).toFixed(2);
        if (next >= crash) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          if (!isCashedOut) setMessage(`💥 Crashed at ${next}x — You lost!`);
        }
        return next;
      });
    }, 50);
  };

  const handleCashOut = () => {
    if (!isRunning || isCashedOut) return;
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsCashedOut(true);
    setMessage(`✅ Cashed out at ${multiplier}x — You win!`);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, []);

  return (
    <div className="aviator-container">
      <h1>Aviator Game 🛩️</h1>
      <h2>Multiplier: <span className="multiplier">{multiplier.toFixed(2)}x</span></h2>
      <h3>{crashPoint ? `Crash Point: ${crashPoint}x` : ''}</h3>
      <div className="buttons">
        <button onClick={startGame} disabled={isRunning}>Place Bet</button>
        <button onClick={handleCashOut} disabled={!isRunning || isCashedOut}>Cash Out</button>
      </div>
      {message && <h2 className="result">{message}</h2>}
    </div>
  );
}

export default App;
