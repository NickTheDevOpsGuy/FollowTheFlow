import { Pad } from '@/components/Pad/Pad';
import { useState } from 'react';
import { Controls } from '@/components/Controls/Controls';
import { createSequence } from '@/utils/sequence';
import { STEP_DURATION, GAP_BETWEEN_STEPS, PadId } from '@/types/types';
import './App.css';

export default function App() {
  const [status, setStatus] = useState('Ready');
  const [sequence, setSequence] = useState<PadId[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  // Round progression
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  // Button label: Start / Continue / Restart
  const buttonLabel = isGameOver
    ? 'Restart'
    : round === 1
      ? 'Start'
      : 'Continue';

  function handlePadClick(padId: PadId) {
    // Block clicking during playback, after game over, or before any sequence exists
    if (isPlayingSequence || isGameOver || sequence.length === 0) {
      return;
    }

    // Flash pad on user click
    setActivePad(padId);
    setTimeout(() => {
      setActivePad(null);
    }, 250);

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
  }

  function playSequence(seq: PadId[]) {
    setIsPlayingSequence(true);
    setStatus('Watch the pattern…');

    seq.forEach((padId, index) => {
      const startTime = index * (STEP_DURATION + GAP_BETWEEN_STEPS);

      setTimeout(() => {
        setActivePad(padId);

        setTimeout(() => {
          setActivePad(null);
        }, STEP_DURATION);
      }, startTime);
    });

    const totalTime = seq.length * (STEP_DURATION + GAP_BETWEEN_STEPS);

    setTimeout(() => {
      setIsPlayingSequence(false);
      setStatus('Your turn');
      setCurrentStep(0);
    }, totalTime);
  }

  function handleStart() {
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
    playSequence(seq);
  }

  return (
    <div className='app-root'>
      <div className='hud'>
        <div className='hud-status'>{status}</div>
        <div className='hud-meta'>
          <span>Round: {round}</span>
          <span>Score: {score}</span>
        </div>
      </div>

      <div className={`pad-grid ${isGameOver ? 'pad-grid--game-over' : ''}`}>
        <Pad
          color='#ff4d4d'
          active={activePad === 0}
          onClick={() => handlePadClick(0)}
        />
        <Pad
          color='#4d94ff'
          active={activePad === 1}
          onClick={() => handlePadClick(1)}
        />
        <Pad
          color='#4dff4d'
          active={activePad === 2}
          onClick={() => handlePadClick(2)}
        />
        <Pad
          color='#ffff4d'
          active={activePad === 3}
          onClick={() => handlePadClick(3)}
        />
      </div>

      <Controls status={status} label={buttonLabel} onStart={handleStart} />
    </div>
  );
}
