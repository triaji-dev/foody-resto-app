import MainLayout from '@/components/layouts/main-layout';
import ProtectedRoute from '@/components/layouts/protected-route';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}
