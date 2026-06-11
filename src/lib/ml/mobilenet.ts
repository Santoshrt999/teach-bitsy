import * as tf from '@tensorflow/tfjs';
import { initBackend } from './backend';

/** Self-hosted MobileNet v3-small feature extractor (Apache-2.0). Same-origin. */
const MODEL_URL = `${import.meta.env.BASE_URL}models/mobilenet-v3-small/model.json`;
const INPUT_SIZE = 224;

/** Dimensionality of the feature vector MobileNet v3-small emits. */
export const EMBED_DIM = 1024;

/** Anything tf.browser.fromPixels accepts (img / canvas / video / ImageBitmap). */
export type PixelSource = Parameters<typeof tf.browser.fromPixels>[0];

let modelPromise: Promise<tf.GraphModel> | null = null;

/** Lazy-load the frozen MobileNet graph model (cached after first call). */
export function loadMobilenet(): Promise<tf.GraphModel> {
  if (!modelPromise) {
    modelPromise = (async () => {
      await initBackend();
      return tf.loadGraphModel(MODEL_URL);
    })();
  }
  return modelPromise;
}

/**
 * Run an image through the frozen extractor and return its 1024-d embedding as a
 * plain Float32Array. All tensors are disposed — nothing leaks.
 */
export async function embedImage(source: PixelSource): Promise<Float32Array> {
  const model = await loadMobilenet();
  const embedding = tf.tidy(() => {
    const input = tf.browser
      .fromPixels(source)
      .resizeBilinear([INPUT_SIZE, INPUT_SIZE])
      .toFloat()
      .div(255) // MobileNet v3 tfhub modules expect inputs in [0, 1]
      .expandDims(0);
    const features = model.predict(input) as tf.Tensor;
    return features.reshape([EMBED_DIM]);
  });
  const data = (await embedding.data()) as Float32Array;
  embedding.dispose();
  return data;
}
