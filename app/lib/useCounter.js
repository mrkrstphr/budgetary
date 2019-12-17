import { useState } from 'react';

export function useCounter(initialCount = 0, min = 0, max = null) {
  const [count, setCount] = useState(initialCount);

  return [
    count,
    () => setCount(max ? Math.min(max, count + 1) : count + 1),
    () => setCount(min ? Math.max(min, count - 1) : count - 1),
  ];
}
