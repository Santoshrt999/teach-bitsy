import { useEffect, useState } from 'react';
import { useStore, countInBucket } from '../state/useStore';
import { canTeach } from '../lib/dataset';
import Bitsy from '../components/Bitsy';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SmartnessMeter from '../components/SmartnessMeter';
import OopsMeter from '../components/OopsMeter';
import Confetti from '../components/Confetti';
import type { BitsyMood } from '../types';

const HIGH_ACCURACY = 0.8;

export default function TeachScreen() {
  const buckets = useStore((s) => s.buckets);
  const examples = useStore((s) => s.examples);
  const grownUpMode = useStore((s) => s.grownUpMode);
  const modelStatus = useStore((s) => s.modelStatus);
  const epochLog = useStore((s) => s.epochLog);
  const finalAccuracy = useStore((s) => s.finalAccuracy);
  const backend = useStore((s) => s.backend);
  const setScreen = useStore((s) => s.setScreen);

  const startTeaching = useStore((s) => s.startTeaching);
  const setModelStatus = useStore((s) => s.setModelStatus);
  const pushEpoch = useStore((s) => s.pushEpoch);
  const finishTeaching = useStore((s) => s.finishTeaching);
  const failTeaching = useStore((s) => s.failTeaching);

  const [showConfetti, setShowConfetti] = useState(false);

  const [a, b] = buckets;
  const ready = canTeach(countInBucket(examples, a.id), countInBucket(examples, b.id));
  const busy = modelStatus === 'warming-up' || modelStatus === 'looking' || modelStatus === 'thinking';
  const liveAcc = epochLog.at(-1)?.acc ?? finalAccuracy ?? 0;
  const trainedWell = modelStatus === 'trained' && (finalAccuracy ?? 0) >= HIGH_ACCURACY;

  // Celebrate once when a strong model finishes training.
  useEffect(() => {
    if (trainedWell) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 3500);
      return () => clearTimeout(t);
    }
  }, [trainedWell]);

  async function handleTeach() {
    startTeaching();
    try {
      const { teach } = await import('../lib/ml/teach');
      const result = await teach(examples, buckets, {
        onPhase: (phase) => setModelStatus(phase),
        onEpoch: (log) => pushEpoch(log),
      });
      finishTeaching(result.accuracy, result.labels, result.backend);
    } catch (err) {
      console.error('[Teach Bitsy] training failed:', err);
      failTeaching();
    }
  }

  const { mood, message } = describe(modelStatus, finalAccuracy, ready);
  const showMeters = epochLog.length > 0 || modelStatus === 'trained';

  return (
    <div className="flex flex-col items-center gap-6">
      {showConfetti && <Confetti />}
      <Bitsy mood={mood} message={message} />

      <Card tint="paper" className="flex w-full max-w-2xl flex-col items-center gap-4 text-center">
        <h2 className="font-display text-2xl font-bold">Teach Bitsy 🧠</h2>
        {ready ? (
          <Button
            variant="mint"
            size="lg"
            onClick={() => void handleTeach()}
            disabled={busy}
          >
            {busy ? 'Learning…' : modelStatus === 'trained' ? '✨ Teach again' : '✨ Teach Bitsy!'}
          </Button>
        ) : (
          <>
            <p className="font-body text-ink/80">
              I need at least 5 pictures in <strong>each</strong> bucket before I can learn.
            </p>
            <Button variant="blue" size="md" onClick={() => setScreen('collect')}>
              ← Go collect pictures
            </Button>
          </>
        )}
      </Card>

      {showMeters && (
        <Card className="flex w-full max-w-2xl flex-col gap-5">
          <SmartnessMeter value={liveAcc} grownUpMode={grownUpMode} />
          <OopsMeter log={epochLog} grownUpMode={grownUpMode} backend={backend} />
        </Card>
      )}

      {(modelStatus === 'warming-up' || modelStatus === 'looking') && (
        <div
          className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-paper/80 backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <Bitsy mood="thinking" size={140} />
          <p className="font-display text-xl font-bold">
            {modelStatus === 'warming-up' ? 'Waking up my brain… 🧠' : 'Looking at your pictures… 👀'}
          </p>
        </div>
      )}
    </div>
  );
}

function describe(
  status: ReturnType<typeof useStore.getState>['modelStatus'],
  acc: number | null,
  ready: boolean,
): { mood: BitsyMood; message: string } {
  switch (status) {
    case 'warming-up':
      return { mood: 'thinking', message: 'Waking up my brain… 🧠' };
    case 'looking':
      return { mood: 'thinking', message: 'Looking at your pictures… 👀' };
    case 'thinking':
      return { mood: 'thinking', message: 'Learning really hard! 🤔' };
    case 'trained':
      return (acc ?? 0) >= HIGH_ACCURACY
        ? { mood: 'proud', message: "I did it! I'm super smart now! 🎉" }
        : { mood: 'confused', message: "I'm a bit muddled — try more or clearer pictures." };
    case 'error':
      return { mood: 'confused', message: 'Uh oh, something went wrong. Let’s try again!' };
    case 'untrained':
    default:
      return ready
        ? { mood: 'curious', message: 'I’m ready! Press the button to learn. ✨' }
        : { mood: 'curious', message: 'Add some pictures and I’ll learn to tell them apart!' };
  }
}
