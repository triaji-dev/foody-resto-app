import Navbar from './navbar';
import Footer from './footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className='bg-background flex min-h-screen flex-col'>
      <Navbar />
      <main className='w-full flex-1'>{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
