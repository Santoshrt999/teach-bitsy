import * as tf from '@tensorflow/tfjs';

// WASM binaries are emitted as same-origin assets (only fetched if WASM is used).
import wasmSimdThreaded from '@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm-threaded-simd.wasm?url';
import wasmSimd from '@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm-simd.wasm?url';
import wasmPlain from '@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm.wasm?url';

export type BackendName = 'webgpu' | 'webgl' | 'wasm' | 'cpu';

let initPromise: Promise<BackendName> | null = null;

/**
 * Initialise TensorFlow.js with the fastest available backend, falling back
 * WebGPU → WebGL → WASM → CPU. Idempotent: the first call does the work, later
 * calls return the same resolved backend. Logs the active backend.
 */
export function initBackend(): Promise<BackendName> {
  if (!initPromise) initPromise = setup();
  return initPromise;
}

async function trySetBackend(name: string): Promise<boolean> {
  try {
    const ok = await tf.setBackend(name);
    if (ok) await tf.ready();
    return ok;
  } catch {
    return false;
  }
}

async function setup(): Promise<BackendName> {
  // 1. WebGPU (fastest; needs navigator.gpu).
  try {
    await import('@tensorflow/tfjs-backend-webgpu');
    if (await trySetBackend('webgpu')) return log('webgpu');
  } catch {
    /* webgpu unavailable */
  }

  // 2. WebGL (bundled in @tensorflow/tfjs).
  if (await trySetBackend('webgl')) return log('webgl');

  // 3. WASM (self-hosted binaries).
  try {
    const wasm = await import('@tensorflow/tfjs-backend-wasm');
    wasm.setWasmPaths({
      'tfjs-backend-wasm.wasm': wasmPlain,
      'tfjs-backend-wasm-simd.wasm': wasmSimd,
      'tfjs-backend-wasm-threaded-simd.wasm': wasmSimdThreaded,
    });
    if (await trySetBackend('wasm')) return log('wasm');
  } catch {
    /* wasm unavailable */
  }

  // 4. CPU (always available; slow).
  await trySetBackend('cpu');
  return log('cpu');
}

function log(name: BackendName): BackendName {
  console.info(`[Teach Bitsy] TensorFlow.js backend: ${name}`);
  return name;
}
