import { useState } from 'react';
import { useStore, countInBucket } from '../state/useStore';
import { datasetNudge } from '../lib/dataset';
import Bitsy from '../components/Bitsy';
import Card from '../components/ui/Card';
import BucketColumn from '../components/BucketColumn';
import Webcam from '../components/Webcam';
import type { BitsyMood } from '../types';

export default function CollectScreen() {
  const buckets = useStore((s) => s.buckets);
  const examples = useStore((s) => s.examples);
  const renameBucket = useStore((s) => s.renameBucket);
  const addExample = useStore((s) => s.addExample);
  const removeExample = useStore((s) => s.removeExample);

  // Which bucket the camera modal is currently adding to (null = closed).
  const [cameraBucketId, setCameraBucketId] = useState<string | null>(null);

  const [a, b] = buckets;
  const countA = countInBucket(examples, a.id);
  const countB = countInBucket(examples, b.id);
  const nudge = datasetNudge(countA, countB);

  const total = countA + countB;
  const mood: BitsyMood = nudge ? 'thinking' : total === 0 ? 'curious' : 'proud';
  const message = nudge ?? (total === 0 ? "Let's collect some pictures! 📦" : "Great pictures! I'm ready to learn. ✨");

  const cameraBucket = buckets.find((x) => x.id === cameraBucketId) ?? null;

  return (
    <div className="flex flex-col items-center gap-6">
      <Bitsy mood={mood} message={message} />

      <Card tint="paper" className="w-full max-w-3xl text-center">
        <h2 className="font-display text-2xl font-bold">Collect pictures 📦</h2>
        <p className="mt-1 font-body text-ink/80">
          Fill each bucket with example pictures. Bitsy will learn to tell them apart!
        </p>
      </Card>

      <div className="grid w-full max-w-3xl gap-5 sm:grid-cols-2">
        <BucketColumn
          bucket={a}
          examples={examples.filter((e) => e.bucketId === a.id)}
          tint="blue"
          onRename={(name) => renameBucket(a.id, name)}
          onAdd={(src) => addExample(a.id, src)}
          onRemove={removeExample}
          onOpenCamera={() => setCameraBucketId(a.id)}
        />
        <BucketColumn
          bucket={b}
          examples={examples.filter((e) => e.bucketId === b.id)}
          tint="coral"
          onRename={(name) => renameBucket(b.id, name)}
          onAdd={(src) => addExample(b.id, src)}
          onRemove={removeExample}
          onOpenCamera={() => setCameraBucketId(b.id)}
        />
      </div>

      {cameraBucket && (
        <Webcam
          bucketName={cameraBucket.name}
          onCapture={(src) => addExample(cameraBucket.id, src)}
          onClose={() => setCameraBucketId(null)}
        />
      )}
    </div>
  );
}
