// src/App.tsx
import { Pad } from "@/components/Pad/Pad";
import { Controls } from "@/components/Controls/Controls";
import { useFlowGame } from "@/hooks/useFlowGame";
import "./App.css";

export default function App() {
  const {
    status,
    isGameOver,
    round,
    score,
    buttonLabel,
    activePad,
    handleStart,
    handlePadClick,
  } = useFlowGame();

  return (
    <div className="app-root">
      <div className="hud">
        <div className="hud-status">{status}</div>
        <div className="hud-meta">
          <span>Round: {round}</span>
          <span>Score: {score}</span>
        </div>
      </div>

      <div className={`pad-grid ${isGameOver ? "pad-grid--game-over" : ""}`}>
        <Pad
          color="#ff4d4d"
          active={activePad === 0}
          onClick={() => handlePadClick(0)}
        />
        <Pad
          color="#4d94ff"
          active={activePad === 1}
          onClick={() => handlePadClick(1)}
        />
        <Pad
          color="#4dff4d"
          active={activePad === 2}
          onClick={() => handlePadClick(2)}
        />
        <Pad
          color="#ffff4d"
          active={activePad === 3}
          onClick={() => handlePadClick(3)}
        />
      </div>

      <Controls label={buttonLabel} onStart={handleStart} />
    </div>
  );
}
