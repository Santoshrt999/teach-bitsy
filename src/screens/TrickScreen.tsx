import Bitsy from '../components/Bitsy';
import Card from '../components/ui/Card';

export default function TrickScreen() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Bitsy mood="confused" message="Uh oh... can you trick me? 😵" />
      <Card tint="paper" className="w-full max-w-2xl text-center">
        <h2 className="font-display text-2xl font-bold">Trick — coming in Phase 4</h2>
        <p className="mt-2 font-body">
          Give me bad examples, watch me get confused, then fix it!
        </p>
      </Card>
    </div>
  );
}
