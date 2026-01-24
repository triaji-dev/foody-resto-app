// Utility functions for navbar styles to replace framer-motion complexity
import { CSSProperties } from 'react';

// Sign In button styles
export const getSignInButtonStyles = (isScrolled: boolean): string => {
  return isScrolled
    ? 'text-foreground border-foreground hover:bg-primary hover:text-white hover:border-primary'
    : 'text-white border-white hover:bg-white hover:text-black hover:border-white';
};

// Sign Up button styles
export const getSignUpButtonStyles = (isScrolled: boolean): string => {
  return isScrolled
    ? 'bg-black border-foreground text-white hover:bg-primary hover:text-white'
    : 'bg-white border-white text-black hover:bg-primary hover:text-white';
};
