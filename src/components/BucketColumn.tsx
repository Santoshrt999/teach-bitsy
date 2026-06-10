import { AnimatePresence } from 'motion/react';
import type { Bucket, Example } from '../state/useStore';
import { MIN_PER_BUCKET } from '../lib/dataset';
import Card from './ui/Card';
import Button from './ui/Button';
import ImageDrop from './ImageDrop';
import PolaroidCard from './PolaroidCard';

interface BucketColumnProps {
  bucket: Bucket;
  examples: Example[];
  tint: 'blue' | 'coral';
  onRename: (name: string) => void;
  onAdd: (src: string) => void;
  onRemove: (exampleId: string) => void;
  onOpenCamera: () => void;
}

const TILTS = [-3, 2, -1.5, 3, -2.5, 1.5];

/** One class bucket: editable name, count, add controls, and a polaroid grid. */
export default function BucketColumn({
  bucket,
  examples,
  tint,
  onRename,
  onAdd,
  onRemove,
  onOpenCamera,
}: BucketColumnProps) {
  const count = examples.length;
  const enough = count >= MIN_PER_BUCKET;

  return (
    <Card tint={tint} className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <input
          value={bucket.name}
          onChange={(e) => onRename(e.target.value)}
          aria-label="Bucket name"
          maxLength={20}
          className="w-full min-w-0 rounded-xl border-4 border-ink bg-white px-3 py-1.5 font-display text-xl font-bold text-ink"
        />
        <span
          className={[
            'flex h-10 shrink-0 items-center rounded-full border-4 border-ink px-3 font-display font-bold',
            enough ? 'bg-mint text-ink' : 'bg-white text-ink/70',
          ].join(' ')}
          aria-label={`${count} pictures`}
        >
          {count}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="yellow" size="sm" onClick={onOpenCamera} className="w-full">
          📸 Use camera
        </Button>
        <ImageDrop onAdd={onAdd} label={bucket.name} />
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
        <AnimatePresence>
          {examples.map((ex, i) => (
            <PolaroidCard
              key={ex.id}
              src={ex.src}
              label={bucket.name}
              tilt={TILTS[i % TILTS.length]}
              onDelete={() => onRemove(ex.id)}
            />
          ))}
        </AnimatePresence>
        {count === 0 && (
          <p className="col-span-3 py-4 text-center font-body text-sm text-ink/50">
            No pictures yet — add some above!
          </p>
        )}
      </div>
    </Card>
  );
}
