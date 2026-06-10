import { describe, it, expect, beforeEach } from 'vitest';
import { useStore, countInBucket } from '../src/state/useStore';

// Reset store between tests so they don't leak state into one another.
beforeEach(() => {
  useStore.setState({ examples: [], buckets: [
    { id: 'a', name: 'Cats' },
    { id: 'b', name: 'Dogs' },
  ] });
});

const s = () => useStore.getState();

describe('dataset store', () => {
  it('adds examples to the right bucket', () => {
    s().addExample('a', 'data:img-1');
    s().addExample('a', 'data:img-2');
    s().addExample('b', 'data:img-3');

    expect(s().examples).toHaveLength(3);
    expect(countInBucket(s().examples, 'a')).toBe(2);
    expect(countInBucket(s().examples, 'b')).toBe(1);
  });

  it('gives each example a unique id and a bucket', () => {
    s().addExample('a', 'data:x');
    s().addExample('a', 'data:y');
    const [e1, e2] = s().examples;
    expect(e1.id).not.toBe(e2.id);
    expect(e1.bucketId).toBe('a');
  });

  it('removes a single example by id', () => {
    s().addExample('a', 'data:x');
    s().addExample('b', 'data:y');
    const target = s().examples.find((e) => e.bucketId === 'a')!;

    s().removeExample(target.id);

    expect(s().examples).toHaveLength(1);
    expect(s().examples[0].bucketId).toBe('b');
  });

  it('renames a bucket without touching its examples', () => {
    s().addExample('a', 'data:x');
    s().renameBucket('a', 'Tigers');

    expect(s().buckets.find((b) => b.id === 'a')!.name).toBe('Tigers');
    expect(countInBucket(s().examples, 'a')).toBe(1);
  });

  it('resets the dataset but keeps bucket names', () => {
    s().renameBucket('a', 'Tigers');
    s().addExample('a', 'data:x');
    s().addExample('b', 'data:y');

    s().resetDataset();

    expect(s().examples).toHaveLength(0);
    expect(s().buckets.find((b) => b.id === 'a')!.name).toBe('Tigers');
  });
});
