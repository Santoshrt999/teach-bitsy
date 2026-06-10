/**
 * Pure dataset helpers — kept free of React/DOM so they're trivially unit-testable.
 */

/** Minimum examples per bucket before Bitsy is happy to learn. */
export const MIN_PER_BUCKET = 5;

/** A balance gap this big or larger earns a "keep them even" nudge. */
export const BALANCE_GAP = 5;

/**
 * Returns a friendly, kid-readable nudge about dataset quality, or `null` when
 * the dataset looks good. Order matters: "need more" takes priority over balance.
 */
export function datasetNudge(countA: number, countB: number): string | null {
  const total = countA + countB;
  if (total === 0) return null; // empty state has its own messaging

  const min = Math.min(countA, countB);
  if (min < MIN_PER_BUCKET) {
    return `Bitsy learns best with at least ${MIN_PER_BUCKET} of each!`;
  }

  const gap = Math.abs(countA - countB);
  if (gap >= BALANCE_GAP) {
    return 'Try to keep both buckets about the same size — it helps Bitsy stay fair!';
  }

  return null;
}

/** Whether the dataset has enough examples in both buckets to start teaching. */
export function canTeach(countA: number, countB: number): boolean {
  return countA >= MIN_PER_BUCKET && countB >= MIN_PER_BUCKET;
}
