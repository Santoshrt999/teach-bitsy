/** Bitsy's facial expression, driven by model state. */
export type BitsyMood = 'curious' | 'thinking' | 'proud' | 'confused';

/** The four tabs of the stepper navigation. */
export type Screen = 'collect' | 'teach' | 'test' | 'trick';

/** Lifecycle of the trainable model. */
export type ModelStatus =
  | 'untrained'
  | 'warming-up' // loading MobileNet
  | 'looking' // computing image embeddings
  | 'thinking' // training the dense head
  | 'trained'
  | 'error';

/** One row of the training log — drives the Smartness + Oops meters. */
export interface EpochLog {
  epoch: number;
  acc: number;
  loss: number;
}
