import Bitsy from '../components/Bitsy';
import Card from '../components/ui/Card';

export default function TeachScreen() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Bitsy mood="thinking" message="Soon you'll teach me to think! 🧠" />
      <Card tint="paper" className="w-full max-w-2xl text-center">
        <h2 className="font-display text-2xl font-bold">Teach — coming in Phase 3</h2>
        <p className="mt-2 font-body">
          The Smartness meter and the Oops (loss) curve will appear here.
        </p>
      </Card>
    </div>
  );
}
