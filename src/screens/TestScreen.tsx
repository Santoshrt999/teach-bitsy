import Bitsy from '../components/Bitsy';
import Card from '../components/ui/Card';

export default function TestScreen() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Bitsy mood="curious" message="Quiz me! Can I guess your picture? 🔮" />
      <Card tint="paper" className="w-full max-w-2xl text-center">
        <h2 className="font-display text-2xl font-bold">Test — coming in Phase 4</h2>
        <p className="mt-2 font-body">Show me something new and I'll guess what it is.</p>
      </Card>
    </div>
  );
}
