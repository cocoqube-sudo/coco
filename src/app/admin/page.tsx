import { Metadata } from 'next';
import { checkAdminAuth } from './actions';
import { getAdminBlogPosts } from '@/lib/blogs';
import { getEnquiries } from '@/lib/enquiries';
import { isSupabaseConfigured } from '@/lib/supabase';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';

export const metadata: Metadata = {
  title: 'Cocoqube Admin Panel | Blogs & Client Enquiries',
  description: 'Manage blog publications and view client RFQ enquiries.',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const isAuthenticated = await checkAdminAuth();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const [posts, enquiries] = await Promise.all([
    getAdminBlogPosts(),
    getEnquiries(),
  ]);

  return (
    <AdminDashboard
      initialPosts={posts}
      initialEnquiries={enquiries}
      isSupabaseConnected={isSupabaseConfigured}
    />
  );
}
