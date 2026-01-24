'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/use-auth';
import { ROUTES } from '@/constants';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getSignInButtonStyles, getSignUpButtonStyles } from './navbar/utils';

import MobileMenu from './navbar/mobile-menu';
import DesktopMenu from './navbar/desktop-menu';
import { CartIcons } from './navbar/cart-icons';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => {
    router.push(ROUTES.AUTH);
  };

  const handleSignUp = () => {
    router.push(`${ROUTES.AUTH}?tab=signup`);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 right-0 left-0 z-50 h-16 px-4 py-3 transition-all duration-100 ease-in-out md:h-20 md:px-30 md:py-4',
        isScrolled ? 'bg-white shadow-sm backdrop-blur-md' : 'bg-transparent'
      )}
    >
      <div
        className={cn(
          'flex-between w-full flex-row transition-all duration-300',
          isScrolled ? 'text-foreground' : 'text-white'
        )}
      >
        <Link
          href={ROUTES.HOME}
          className='group flex items-center gap-2 font-bold no-underline'
          onClick={(e) => {
            if (pathname === ROUTES.HOME) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <div className='flex items-center gap-4 font-bold transition-transform group-hover:scale-105'>
            <Image
              src='/icons/logo-foody.svg'
              alt='Foody Logo'
              width={42}
              height={42}
              className='h-10 w-10 transition-all duration-300 md:h-10.5 md:w-10.5'
              style={{
                filter: isScrolled ? 'none' : 'brightness(0) invert(1)',
              }}
            />
            <span className='display-md-extrabold hidden md:block'>Foody</span>
          </div>
        </Link>

        <div className='flex flex-row items-center gap-3'>
          {isAuthenticated ? (
            <>
              <CartIcons isScrolled={isScrolled} />
              <DesktopMenu isScrolled={isScrolled} />
            </>
          ) : (
            <div className='hidden items-center gap-3 md:flex'>
              <button
                onClick={handleSignIn}
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'none' }),
                  'transition-all duration-200 hover:scale-105 active:scale-95',
                  getSignInButtonStyles(isScrolled)
                )}
              >
                Sign In
              </button>

              <button
                onClick={handleSignUp}
                className={cn(
                  buttonVariants({ variant: 'default', size: 'none' }),
                  'transition-all duration-200 hover:scale-105 active:scale-95',
                  getSignUpButtonStyles(isScrolled)
                )}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu */}
          <MobileMenu isScrolled={isScrolled} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
