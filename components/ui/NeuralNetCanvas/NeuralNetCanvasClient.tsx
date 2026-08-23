'use client';

import dynamic from 'next/dynamic';

const NeuralNetCanvas = dynamic(
  () =>
    import('@/components/ui/NeuralNetCanvas/NeuralNetCanvas').then((m) => ({
      default: m.NeuralNetCanvas,
    })),
  { ssr: false }
);

export function NeuralNetCanvasClient() {
  return <NeuralNetCanvas />;
}
