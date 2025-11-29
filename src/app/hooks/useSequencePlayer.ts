import { useState } from 'react';
import { STEP_DURATION, GAP_BETWEEN_STEPS, PadId } from '@/types/types';

export function useSequencePlayer() {
  const [activePad, setActivePad] = useState<number | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);

  const playSequence = (seq: PadId[], onDone: () => void) => {
    setIsPlayingSequence(true);

    seq.forEach((padId, index) => {
      const startTime = index * (STEP_DURATION + GAP_BETWEEN_STEPS);

      setTimeout(() => {
        setActivePad(padId);

        setTimeout(() => {
          setActivePad(null);
        }, STEP_DURATION);
      }, startTime);
    });

    // Total playback time
    const totalTime = seq.length * (STEP_DURATION + GAP_BETWEEN_STEPS);

    setTimeout(() => {
      setIsPlayingSequence(false);
      onDone(); // App decides what happens next
    }, totalTime);
  };

  const flashPad = (padId: PadId, duration = 250) => {
    setActivePad(padId);
    setTimeout(() => {
      setActivePad(null);
    }, duration);
  };

  return {
    activePad,
    isPlayingSequence,
    playSequence,
    flashPad,
  };
}
