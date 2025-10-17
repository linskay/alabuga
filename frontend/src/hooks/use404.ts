import { useCallback } from 'react';

export const use404 = () => {
  const show404 = useCallback(() => {
    if ((window as any).show404) {
      (window as any).show404();
    }
  }, []);

  return { show404 };
};
