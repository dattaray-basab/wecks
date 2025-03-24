import { useState, useEffect } from "react";
import { GetCount, Start, Stop, IsRunning } from "../../wailsjs/go/main/App";
import { EventsOn, EventsOff } from "../../wailsjs/runtime/runtime";

const Counter = () => {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Get initial count and timer status
    GetCount().then(setCount);
    IsRunning().then(setIsRunning);

    // Subscribe to count updates
    EventsOn("count-updated", (count: number) => {
      setCount(count);
    });

    // Cleanup subscription
    return () => {
      EventsOff("count-updated");
    };
  }, []);

  const handleToggleTimer = async () => {
    if (isRunning) {
      await Stop();
      setIsRunning(false);
    } else {
      await Start();
      setIsRunning(true);
    }
  };

  return (
    <div className='counter-container'>
      <h2>Timer Counter Example</h2>
      <div className='counter-display'>Count: {count}</div>
      <div className='counter-buttons'>
        <button
          onClick={handleToggleTimer}
          style={{
            backgroundColor: isRunning ? "#dc3545" : "#4CAF50",
          }}>
          {isRunning ? "Stop" : "Start"} Timer
        </button>
      </div>
      <style>{`
                .counter-container {
                    text-align: center;
                    padding: 2rem;
                    font-family: Arial, sans-serif;
                }
                .counter-display {
                    font-size: 2rem;
                    margin: 1rem 0;
                }
                .counter-buttons {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                button {
                    padding: 0.5rem 1rem;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    min-width: 120px;
                    transition: background-color 0.3s ease;
                }
                button:hover {
                    filter: brightness(90%);
                }
            `}</style>
    </div>
  );
};

export default Counter;
