'use client';

import { useState, useEffect } from 'react';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setIsClient(true);

    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = isClient ? screenSize.width < breakpoints.md : false;
  const isTablet = isClient
    ? screenSize.width >= breakpoints.md && screenSize.width < breakpoints.lg
    : false;
  const isDesktop = isClient ? screenSize.width >= breakpoints.lg : true;

  const isAtLeast = (breakpoint: Breakpoint) => {
    if (!isClient) return true;
    return screenSize.width >= breakpoints[breakpoint];
  };

  return {
    width: screenSize.width,
    height: screenSize.height,
    isMobile,
    isTablet,
    isDesktop,
    isAtLeast,
    isClient,
  };
}
