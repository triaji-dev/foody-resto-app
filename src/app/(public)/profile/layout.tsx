'use client';

import { ProfileSidebar } from '@/components/views/profile/components/profile-sidebar';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-neutral-50 pt-24 pb-20 font-sans'>
      <div className='container mx-auto max-w-6xl px-4'>
        <div className='flex flex-col gap-8 lg:flex-row'>
          {/* Sidebar (Left Column) */}
          <div className='w-full shrink-0 lg:w-64'>
            <ProfileSidebar />
          </div>

          {/* Main Content (Right Column) */}
          <div className='flex-1'>{children}</div>
        </div>
      </div>
    </div>
  );
}
