import Bitsy from '../components/Bitsy';
import Card from '../components/ui/Card';
import type { BitsyMood } from '../types';

// Temporary Phase-1 mood gallery so every expression can be eyeballed.
// Replaced by the real Collect UI in Phase 2.
const MOODS: BitsyMood[] = ['curious', 'thinking', 'proud', 'confused'];

export default function CollectScreen() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Bitsy mood="curious" message="Let's collect some pictures together! 📦" />

      <Card tint="paper" className="w-full max-w-2xl text-center">
        <h2 className="font-display text-2xl font-bold">Collect — coming in Phase 2</h2>
        <p className="mt-2 font-body">
          Two buckets, webcam capture, and drag-in photos will live here.
        </p>
      </Card>

      <Card className="w-full max-w-2xl">
        <p className="mb-4 text-center font-display font-semibold text-ink/70">
          Bitsy mood preview (Phase 1 check)
        </p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {MOODS.map((mood) => (
            <div key={mood} className="flex flex-col items-center gap-2">
              <Bitsy mood={mood} size={96} />
              <span className="font-display text-sm font-semibold capitalize">{mood}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
