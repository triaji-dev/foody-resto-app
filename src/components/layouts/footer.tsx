import Link from 'next/link';
import Image from 'next/image';
import {
  FOOTER_BRAND,
  FOOTER_SOCIAL_LINKS,
  FOOTER_NAV_SECTIONS,
} from '@/constants';

function Footer() {
  return (
    <footer className='bg-neutral-950 px-4 text-white sm:px-[clamp(1rem,8.33vw,7.5rem)]'>
      <div className='w-full py-12 md:py-16'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12'>
          {/* Brand Section */}
          <div className='space-y-10'>
            <div className='space-y-5.5'>
              {/* Logo and Brand Name */}
              <div className='flex items-center gap-3'>
                <Image
                  src={FOOTER_BRAND.logo}
                  alt={`${FOOTER_BRAND.name} Logo`}
                  width={44}
                  height={44}
                  className='h-11 w-11'
                  style={{
                    filter:
                      'brightness(0) saturate(100%) invert(18%) sepia(97%) saturate(4456%) hue-rotate(354deg) brightness(95%) contrast(94%)',
                  }}
                />
                <span className='display-md font-extrabold text-white'>
                  {FOOTER_BRAND.name}
                </span>
              </div>

              {/* Brand Description */}
              <p className='text-md max-w-sm text-neutral-300'>
                {FOOTER_BRAND.description}
              </p>
            </div>

            {/* Social Media Section */}
            <div className='space-y-5'>
              <h3 className='text-lg font-semibold text-white'>
                Follow on Social Media
              </h3>
              <div className='flex gap-4'>
                {FOOTER_SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white'
                    aria-label={social.ariaLabel}
                  >
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={20}
                      height={20}
                      className='h-5 w-5'
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-8'>
            {FOOTER_NAV_SECTIONS.map((section) => (
              <div key={section.title} className='space-y-5'>
                <h3 className='text-md-custom font-extrabold text-white'>
                  {section.title}
                </h3>
                <nav className='space-y-5'>
                  {section.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className='text-md-custom text-neutral-25 hover:text-primary block transition-colors'
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
