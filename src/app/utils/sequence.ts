// src/utils/sequence.ts

import { PadId } from "@/types/types";

const PAD_IDS: PadId[] = [0, 1, 2, 3];

export function createSequence(length: number): PadId[] {
  const seq: PadId[] = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * PAD_IDS.length);
    seq.push(PAD_IDS[randomIndex]);
  }
  return seq;
}
