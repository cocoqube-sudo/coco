import { Metadata } from 'next';
import { checkAdminAuth } from './actions';
import { getAdminBlogPosts } from '@/lib/blogs';
import { isSupabaseConfigured } from '@/lib/supabase';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';

export const metadata: Metadata = {
  title: 'Blog Admin Panel | Cocoqube',
  description: 'Manage and publish blog articles connected to Supabase.',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const isAuthenticated = await checkAdminAuth();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const posts = await getAdminBlogPosts();

  return (
    <AdminDashboard
      initialPosts={posts}
      isSupabaseConnected={isSupabaseConfigured}
    />
  );
}
