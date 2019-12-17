import { useState } from 'react';

export function useToggle(defaultValue = false) {
  const [toggled, setToggled] = useState(defaultValue);

  return [toggled, () => setToggled(!toggled)];
}
