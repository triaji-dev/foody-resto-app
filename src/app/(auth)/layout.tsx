import AuthLayout from '@/components/layouts/auth-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Title/Subtitle can be made dynamic by checking pathname or adding a client wrapper
  // For now, simpler implementation is to just wrap, or specific pages can just componentize
  // But wait, user wanted AuthLayout applied. AuthLayout has props.
  // Best approach for Route Group Layout: Keep it generic or use page specific layouts?
  // Since Layout wraps all, we'll make a generic wrapper or just let pages use AuthLayout?
  // Actually, standard Next.js pattern: Layout wraps children. If AuthLayout needs title,
  // maybe AuthLayout should be used inside page.tsx instead?
  // Let's check AuthLayout definition... it takes title/subtitle.
  // So we CAN'T easily use it in layout.tsx unless it's generic.
  // ALTERNATIVE: Use MainLayout style wrapper here if we want a common shell.
  // If AuthLayout has page-specific titles, it's better used IN the page.
  // BUT the request was to apply layouts via folder structure.
  // Let's make a GenericAuthLayout for the folder that centers content,
  // and pages render the card content?
  // Let's look at AuthLayout again...
  /*
    function AuthLayout({ children, title, subtitle }: AuthLayoutProps) { ... }
  */
  // It renders the Logo and Title.
  // So it's a Page Wrapper.
  // DECISION: In (auth)/layout.tsx, we can't fully use AuthLayout if titles vary.
  // We will just render children here (pass-through) and let pages use AuthLayout,
  // OR refactor AuthLayout to read metadata?
  // Let's implement a simple pass-through layout or just a centering div.
  // Actually, let's just output children for now to avoid breaking titles.
  // Wait, user goal "Visual Layout".
  // Let's refactor AuthLayout to be a layout shell? No, title is specific.
  // I will make (auth)/layout.tsx just a shell (maybe the gray background?)

  return (
    <div className='flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8'>
      {children}
    </div>
  );
}
