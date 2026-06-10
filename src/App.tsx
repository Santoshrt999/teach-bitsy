import { useStore } from './state/useStore';
import type { Screen } from './types';
import CollectScreen from './screens/CollectScreen';
import TeachScreen from './screens/TeachScreen';
import TestScreen from './screens/TestScreen';
import TrickScreen from './screens/TrickScreen';

const STEPS: { id: Screen; label: string; emoji: string }[] = [
  { id: 'collect', label: 'Collect', emoji: '📦' },
  { id: 'teach', label: 'Teach', emoji: '🧠' },
  { id: 'test', label: 'Test', emoji: '🔮' },
  { id: 'trick', label: 'Trick', emoji: '😵' },
];

const SCREENS: Record<Screen, () => React.JSX.Element> = {
  collect: CollectScreen,
  teach: TeachScreen,
  test: TestScreen,
  trick: TrickScreen,
};

export default function App() {
  const screen = useStore((s) => s.screen);
  const setScreen = useStore((s) => s.setScreen);
  const grownUpMode = useStore((s) => s.grownUpMode);
  const toggleGrownUpMode = useStore((s) => s.toggleGrownUpMode);

  const ActiveScreen = SCREENS[screen];
  const activeIndex = STEPS.findIndex((s) => s.id === screen);

  // Arrow-key navigation across the stepper tabs (a11y).
  function onTabKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const next = (activeIndex + dir + STEPS.length) % STEPS.length;
    setScreen(STEPS[next].id);
  }

  return (
    <div className="min-h-dvh bg-paper">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-4 pt-6">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          Teach Bitsy <span aria-hidden>🤖</span>
        </h1>
        <label className="flex cursor-pointer items-center gap-2 rounded-full border-4 border-ink bg-white px-3 py-1.5 font-display text-sm font-semibold shadow-hard-sm">
          <input
            type="checkbox"
            checked={grownUpMode}
            onChange={toggleGrownUpMode}
            className="h-4 w-4 accent-[var(--color-coral)]"
          />
          Grown-up mode
        </label>
      </header>

      <nav className="mx-auto max-w-4xl px-4 pt-5">
        <div
          role="tablist"
          aria-label="Teach Bitsy steps"
          className="flex gap-2 sm:gap-3"
          onKeyDown={onTabKeyDown}
        >
          {STEPS.map((step, i) => {
            const selected = step.id === screen;
            return (
              <button
                key={step.id}
                role="tab"
                id={`tab-${step.id}`}
                aria-selected={selected}
                aria-controls={`panel-${step.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setScreen(step.id)}
                className={[
                  'flex flex-1 flex-col items-center rounded-2xl border-4 border-ink px-2 py-2 font-display font-semibold transition-transform sm:flex-row sm:justify-center sm:gap-2',
                  selected
                    ? 'bg-yellow text-ink shadow-hard'
                    : 'bg-white text-ink/70 shadow-hard-sm hover:-translate-y-0.5',
                ].join(' ')}
              >
                <span aria-hidden className="text-xl sm:text-2xl">
                  {step.emoji}
                </span>
                <span className="text-xs sm:text-base">
                  <span aria-hidden className="mr-1 opacity-60">
                    {i + 1}.
                  </span>
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <main
        id={`panel-${screen}`}
        role="tabpanel"
        aria-labelledby={`tab-${screen}`}
        className="mx-auto max-w-4xl px-4 py-8"
      >
        <ActiveScreen />
      </main>

      <footer className="pb-8 text-center font-body text-sm text-ink/60">
        100% on-device · No accounts · No uploads · No tracking
      </footer>
    </div>
  );
}
