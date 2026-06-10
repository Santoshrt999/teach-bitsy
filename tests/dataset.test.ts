import { describe, it, expect } from 'vitest';
import { datasetNudge, canTeach, MIN_PER_BUCKET } from '../src/lib/dataset';

describe('datasetNudge', () => {
  it('says nothing when both buckets are empty', () => {
    expect(datasetNudge(0, 0)).toBeNull();
  });

  it('asks for more when either bucket is below the minimum', () => {
    expect(datasetNudge(2, 9)).toMatch(/at least 5/i);
    expect(datasetNudge(9, 2)).toMatch(/at least 5/i);
  });

  it('warns about imbalance once both buckets have enough', () => {
    expect(datasetNudge(5, 12)).toMatch(/same size/i);
  });

  it('is happy with a healthy, balanced dataset', () => {
    expect(datasetNudge(8, 9)).toBeNull();
  });

  it('prioritises "need more" over "imbalance"', () => {
    // One bucket is tiny AND the gap is large → should ask for more first.
    expect(datasetNudge(1, 20)).toMatch(/at least 5/i);
  });
});

describe('canTeach', () => {
  it('is false until both buckets reach the minimum', () => {
    expect(canTeach(MIN_PER_BUCKET - 1, 10)).toBe(false);
    expect(canTeach(10, MIN_PER_BUCKET - 1)).toBe(false);
  });

  it('is true when both buckets meet the minimum', () => {
    expect(canTeach(MIN_PER_BUCKET, MIN_PER_BUCKET)).toBe(true);
  });
});
