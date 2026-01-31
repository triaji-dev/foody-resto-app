import { useEffect } from 'react';

/**
 * Hook to scroll the window to the top on mount and before page unload.
 */
export function useScrollToTop() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Reset scroll position before page unload so browser restores to top
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}
