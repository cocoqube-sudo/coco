'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { BLOG_POSTS } from '@/data/blogs';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'cocoqube2026';
const COOKIE_NAME = 'cocoqube_admin_auth';

export async function loginAdmin(password: string) {
  const entered = (password || '').trim();
  const configured = (process.env.ADMIN_PASSWORD || 'cocoqube2026').trim();
  const cleanConfigured = configured.replace(/^["']|["']$/g, '');

  // Accept entered password if it matches the configured value OR the default fallback
  if (entered === cleanConfigured || entered === 'cocoqube2026') {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    return { success: true };
  }
  return { success: false, error: 'Incorrect administrator password. Please enter: cocoqube2026' };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return { success: true };
}

export async function checkAdminAuth() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === 'authenticated';
}

export async function saveBlogPost(formData: {
  id?: string;
  title: string;
  slug: string;
  category: string;
  read_time: string;
  author: string;
  image: string;
  image_alt: string;
  excerpt: string;
  content: string;
  is_published: boolean;
}) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized. Please sign in to the admin panel.' };
  }

  if (!isSupabaseConfigured || !supabaseAdmin) {
    return {
      success: false,
      error: 'Supabase is not configured yet. Please add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.',
    };
  }

  // Ensure slug is clean
  const cleanSlug = formData.slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-');

  const payload = {
    title: formData.title.trim(),
    slug: cleanSlug,
    category: formData.category.trim() || 'Agronomy',
    read_time: formData.read_time.trim() || '5 min read',
    published_at: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    author: formData.author.trim() || 'Cocoqube Technical Desk',
    image: formData.image.trim() || '/images/process-qc.jpg',
    image_alt: formData.image_alt.trim() || formData.title.trim(),
    excerpt: formData.excerpt.trim(),
    content: formData.content.trim(),
    is_published: formData.is_published,
  };

  try {
    if (formData.id && !formData.id.startsWith('local-')) {
      // Update
      const { error } = await supabaseAdmin
        .from('blogs')
        .update(payload)
        .eq('id', formData.id);

      if (error) throw error;
    } else {
      // Insert
      const { error } = await supabaseAdmin
        .from('blogs')
        .insert([payload]);

      if (error) throw error;
    }

    revalidatePath('/resources');
    revalidatePath('/blogs');
    revalidatePath(`/blogs/${cleanSlug}`);
    revalidatePath('/admin');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Database error while saving blog post.' };
  }
}

export async function deleteBlogPost(id: string) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized.' };
  }

  if (!isSupabaseConfigured || !supabaseAdmin) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  try {
    const { error } = await supabaseAdmin.from('blogs').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/resources');
    revalidatePath('/blogs');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error deleting article.' };
  }
}

export async function togglePublishStatus(id: string, currentStatus: boolean) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized.' };
  }

  if (!isSupabaseConfigured || !supabaseAdmin) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  try {
    const { error } = await supabaseAdmin
      .from('blogs')
      .update({ is_published: !currentStatus })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/resources');
    revalidatePath('/blogs');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function seedInitialBlogs() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return { success: false, error: 'Unauthorized.' };
  }

  if (!isSupabaseConfigured || !supabaseAdmin) {
    return {
      success: false,
      error: 'Please connect your Supabase credentials in .env.local first before seeding.',
    };
  }

  try {
    const records = BLOG_POSTS.map((post) => ({
      slug: post.slug,
      title: post.title,
      category: post.category,
      read_time: post.readTime,
      published_at: post.date,
      author: post.author,
      image: post.image,
      image_alt: post.imageAlt,
      excerpt: post.excerpt,
      content: post.content.join('\n\n'),
      is_published: true,
    }));

    const { error } = await supabaseAdmin
      .from('blogs')
      .upsert(records, { onConflict: 'slug' });

    if (error) throw error;

    revalidatePath('/resources');
    revalidatePath('/blogs');
    revalidatePath('/admin');
    return { success: true, count: records.length };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error seeding blogs to Supabase.' };
  }
}

export async function updateLeadStatus(id: string, status: 'new' | 'contacted' | 'quoted' | 'closed') {
  const isAuth = await checkAdminAuth();
  if (!isAuth) return { success: false, error: 'Unauthorized' };
  const { updateEnquiryStatus } = await import('@/lib/enquiries');
  const res = await updateEnquiryStatus(id, status);
  revalidatePath('/admin');
  return res;
}

export async function deleteLead(id: string) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) return { success: false, error: 'Unauthorized' };
  const { deleteEnquiry } = await import('@/lib/enquiries');
  const res = await deleteEnquiry(id);
  revalidatePath('/admin');
  return res;
}

