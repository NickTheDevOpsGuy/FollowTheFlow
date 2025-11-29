import { useState } from 'react';
import { PadId } from '@/types/types';
import { createSequence } from '@/utils/sequence';
import { useSequencePlayer } from '@/hooks/useSequencePlayer';

export function useFlowGame() {
  const [status, setStatus] = useState('Ready');
  const [sequence, setSequence] = useState<PadId[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Round progression
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const { activePad, isPlayingSequence, playSequence, flashPad } =
    useSequencePlayer();

  // Button label: Start / Continue / Restart
  const buttonLabel = isGameOver
    ? 'Restart'
    : round === 1
      ? 'Start'
      : 'Continue';

  const handlePadClick = (padId: PadId) => {
    if (isPlayingSequence || isGameOver || sequence.length === 0) {
      return;
    }

    flashPad(padId); // replaces the manual setTimeout logic

    const expected = sequence[currentStep];

    if (padId === expected) {
      const nextStep = currentStep + 1;

      if (nextStep === sequence.length) {
        // Player completed the whole sequence
        setScore((prev) => prev + sequence.length);
        setRound((prev) => prev + 1);
        setStatus('Nice! Press Continue for the next round');
        // currentStep will be reset on the next Start
      } else {
        setCurrentStep(nextStep);
        console.log('correct click', padId);
      }
    } else {
      // Wrong click → Game Over
      console.log('wrong click', padId, 'expected', expected);
      setIsGameOver(true);
      setStatus('Game over – press Restart to try again');
    }
  };

  const handleStart = () => {
    setStatus('Playing...');

    // If we’re restarting after game over, reset progression
    if (isGameOver) {
      setIsGameOver(false);
      setRound(1);
      setScore(0);
    }

    const seqLength = round; // sequence gets longer as rounds progress
    const seq = createSequence(seqLength);

    setSequence(seq);
    setCurrentStep(0);

    playSequence(seq, () => {
      setStatus('Your turn');
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
  };
}
