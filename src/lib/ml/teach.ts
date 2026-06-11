import type { Bucket, Example } from '../../state/useStore';
import type { EpochLog } from '../../types';
import { dataUrlToImage } from '../image';
import { initBackend, type BackendName } from './backend';
import { embedImage } from './mobilenet';
import { trainHead } from './classifier';

/**
 * Per-image embedding cache, keyed by example id. Embeddings depend only on the
 * picture (not its label), so the cache survives relabelling and retrains —
 * which is what keeps Teach (and the Trick→Fix retrains) effectively instant.
 */
const embeddingCache = new Map<string, Float32Array>();

export interface TeachCallbacks {
  onPhase: (phase: 'warming-up' | 'looking' | 'thinking') => void;
  onEmbedProgress?: (done: number, total: number) => void;
  onEpoch: (log: EpochLog) => void;
}

export interface TeachResult {
  accuracy: number;
  labels: string[];
  backend: BackendName;
}

/**
 * Full transfer-learning run: init backend → load MobileNet → embed each example
 * (cached) → train the dense head. Returns final accuracy + class label order.
 */
export async function teach(
  examples: Example[],
  buckets: Bucket[],
  cb: TeachCallbacks,
): Promise<TeachResult> {
  cb.onPhase('warming-up');
  const backend = await initBackend();

  const used = examples.filter((e) => buckets.some((b) => b.id === e.bucketId));
  const labels = buckets.map((b) => b.name);

  cb.onPhase('looking');
  const embeddings: Float32Array[] = [];
  const labelIndices: number[] = [];
  let done = 0;
  for (const ex of used) {
    let emb = embeddingCache.get(ex.id);
    if (!emb) {
      const img = await dataUrlToImage(ex.src);
      emb = await embedImage(img);
      embeddingCache.set(ex.id, emb);
    }
    embeddings.push(emb);
    labelIndices.push(buckets.findIndex((b) => b.id === ex.bucketId));
    cb.onEmbedProgress?.(++done, used.length);
  }

  cb.onPhase('thinking');
  const accuracy = await trainHead(embeddings, labelIndices, buckets.length, cb.onEpoch);

  return { accuracy, labels, backend };
}

/** Drop cached embeddings for examples that no longer exist (and on full reset). */
export function pruneEmbeddingCache(validIds: Set<string>): void {
  for (const id of embeddingCache.keys()) {
    if (!validIds.has(id)) embeddingCache.delete(id);
  }
}

export function clearEmbeddingCache(): void {
  embeddingCache.clear();
}
