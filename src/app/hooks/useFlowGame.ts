import { useState } from "react";
import { PadId } from "@/types/types";
import { createSequence } from "@/utils/sequence";
import { useSequencePlayer } from "@/hooks/useSequencePlayer";

type Difficulty = "easy" | "normal" | "hard";
type DifficultyState = Difficulty | "unset";

function getSeqLength(round: number, difficulty: Difficulty) {
  switch (difficulty) {
    case "easy":
      return round;
    case "normal":
      return Math.floor(1.3 * round);
    case "hard":
      return Math.floor(round * 1.5 + 1);
    default:
      return round;
  }
}

export function useFlowGame() {
  const [status, setStatus] = useState("Ready");
  const [sequence, setSequence] = useState<PadId[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Round progression
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  // Difficulty selection
  const [difficulty, setDifficulty] = useState<DifficultyState>("unset");
  const [isDifficultyLocked, setIsDifficultyLocked] = useState(false);

  const { activePad, isPlayingSequence, playSequence, flashPad } =
    useSequencePlayer();

  // Button label: Start / Continue / Restart
  const buttonLabel = isGameOver
    ? "Restart"
    : round === 1
    ? "Start"
    : "Continue";

  const handlePadClick = (padId: PadId) => {
    // Block clicking during playback, after game over, or before any sequence exists
    if (isPlayingSequence || isGameOver || sequence.length === 0) {
      return;
    }

    // Flash pad on user click
    flashPad(padId);

    const expected = sequence[currentStep];

    if (padId === expected) {
      const nextStep = currentStep + 1;

      if (nextStep === sequence.length) {
        // Player completed the whole sequence
        setScore((prev) => prev + sequence.length);
        setRound((prev) => prev + 1);
        setStatus("Nice! Press Continue for the next round");
        // currentStep will be reset on the next Start
      } else {
        setCurrentStep(nextStep);
      }
    } else {
      // Wrong click → Game Over
      setIsGameOver(true);
      setIsDifficultyLocked(false); // allow changing difficulty before restart
      setStatus("Game over – press Restart to try again");
    }
  };

  const handleStart = () => {
     if (difficulty === "unset") {
        setStatus("Pick a difficulty first");
        return;
    }
    
    setStatus("Playing...");

    // Lock difficulty on first start of a run
    if (!isDifficultyLocked) {
      setIsDifficultyLocked(true);
    }

    // If we’re restarting after game over, reset progression
    if (isGameOver) {
      setIsGameOver(false);
      setRound(1);
      setScore(0);
    }

    const seqLength = getSeqLength(round, difficulty);
    const seq = createSequence(seqLength);

    setSequence(seq);
    setCurrentStep(0);

    playSequence(seq, () => {
      setStatus("Your turn");
      setCurrentStep(0);
    });
  };

  return {
    status,
    sequence,
    currentStep,
    isGameOver,
    round,
    score,
    buttonLabel,
    activePad,
    isPlayingSequence,
    handlePadClick,
    handleStart,
    difficulty,
    setDifficulty,
    isDifficultyLocked,
  };
}
