import { useId, useRef, useState } from 'react';
import { fileToExampleDataUrl } from '../lib/image';

interface ImageDropProps {
  /** Called once per successfully-processed image with its normalised data URL. */
  onAdd: (src: string) => void;
  label: string;
}

/** Drag-and-drop zone + file picker that normalises images before adding them. */
export default function ImageDrop({ onAdd, label }: ImageDropProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    for (const file of Array.from(files)) {
      try {
        const src = await fileToExampleDataUrl(file);
        onAdd(src);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not add that picture.');
      }
    }
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={[
          'flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-4 border-dashed border-ink/50 px-4 py-4 text-center font-display text-sm font-semibold text-ink/70 transition-colors',
          dragging ? 'bg-blue/30' : 'bg-white hover:bg-blue/10',
        ].join(' ')}
      >
        <span aria-hidden className="text-2xl">
          🖼️
        </span>
        Drop pictures here or tap to choose
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          aria-label={`Add ${label} pictures from your device`}
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </label>
      {error && (
        <p role="alert" className="mt-1 text-center font-body text-sm text-coral">
          {error}
        </p>
      )}
    </div>
  );
}
