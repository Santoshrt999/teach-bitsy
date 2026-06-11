import * as tf from '@tensorflow/tfjs';
import type { EpochLog } from '../../types';
import { EMBED_DIM } from './mobilenet';
import { LEARNING_RATE, EPOCHS } from './config';

// The trainable head lives here as a singleton so predictions (Phase 4) can reuse
// it. MobileNet stays frozen; only this tiny dense net learns.
let head: tf.Sequential | null = null;

/** A frozen MobileNet embedding feeds this 2-layer trainable head. */
function buildHead(numClasses: number): tf.Sequential {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [EMBED_DIM], units: 100, activation: 'relu' }));
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));
  model.compile({
    optimizer: tf.train.adam(LEARNING_RATE),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  return model;
}

function flatten(embeddings: Float32Array[]): Float32Array {
  const out = new Float32Array(embeddings.length * EMBED_DIM);
  embeddings.forEach((e, i) => out.set(e, i * EMBED_DIM));
  return out;
}

/**
 * Train the dense head on precomputed embeddings. Because embeddings are cached
 * upstream, this is the only per-"teach" compute and finishes in well under a
 * second. Returns the final training accuracy ("Smartness").
 */
export async function trainHead(
  embeddings: Float32Array[],
  labelIndices: number[],
  numClasses: number,
  onEpoch: (log: EpochLog) => void,
): Promise<number> {
  disposeHead();
  head = buildHead(numClasses);

  const xs = tf.tensor2d(flatten(embeddings), [embeddings.length, EMBED_DIM]);
  const ys = tf.oneHot(tf.tensor1d(labelIndices, 'int32'), numClasses);

  let finalAcc = 0;
  await head.fit(xs, ys, {
    epochs: EPOCHS,
    batchSize: Math.min(16, embeddings.length),
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        // tfjs reports accuracy under 'acc' (or 'accuracy' on some versions).
        const acc = (logs?.acc ?? logs?.accuracy ?? 0) as number;
        const loss = (logs?.loss ?? 0) as number;
        finalAcc = acc;
        onEpoch({ epoch: epoch + 1, acc, loss });
      },
    },
  });

  xs.dispose();
  ys.dispose();
  return finalAcc;
}

/** Predict class probabilities (softmax) for one embedding. */
export function predict(embedding: Float32Array): Float32Array {
  if (!head) throw new Error('Bitsy has not been taught yet.');
  return tf.tidy(() => {
    const x = tf.tensor2d(embedding, [1, EMBED_DIM]);
    const out = head!.predict(x) as tf.Tensor;
    return out.dataSync() as Float32Array;
  });
}

export function isTrained(): boolean {
  return head !== null;
}

export function disposeHead(): void {
  if (!head) return;
  // model.dispose() frees the layer weights but NOT the Adam optimizer's slot
  // variables (m/v accumulators) — dispose those explicitly to avoid a leak that
  // would otherwise grow with every retrain.
  head.optimizer?.dispose();
  head.dispose();
  head = null;
}
