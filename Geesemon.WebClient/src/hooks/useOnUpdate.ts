import { useRef, useEffect, EffectCallback, DependencyList } from 'react';

export const useOnUpdate = (effect: EffectCallback, dependencies?: DependencyList): void => {
  const didMountRef = useRef<undefined | true>();

  useEffect(() => {
    if (didMountRef.current)
      return effect();

    didMountRef.current = true;
  }, dependencies);
};
