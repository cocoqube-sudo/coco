import { supabase, supabaseAdmin, isSupabaseConfigured } from './supabase';
import { BLOG_POSTS, BlogPost } from '@/data/blogs';

export interface DbBlogPost {
  id?: string;
  slug: string;
  title: string;
  category: string;
  read_time: string;
  published_at?: string;
  author: string;
  image: string;
  image_alt: string;
  excerpt: string;
  content: string;
  is_published: boolean;
  created_at?: string;
}

// Convert DB format to client format
function formatDbPost(dbPost: DbBlogPost): BlogPost {
  // If content is a multiline string, split by double newlines into paragraphs
  const contentParagraphs = dbPost.content
    ? dbPost.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  return {
    slug: dbPost.slug,
    title: dbPost.title,
    category: dbPost.category || 'Agronomy',
    readTime: dbPost.read_time || '5 min read',
    date: dbPost.published_at || '2026',
    author: dbPost.author || 'Cocoqube Technical Desk',
    image: dbPost.image || '/images/process-qc.jpg',
    imageAlt: dbPost.image_alt || dbPost.title,
    excerpt: dbPost.excerpt || '',
    content: contentParagraphs.length > 0 ? contentParagraphs : [dbPost.content],
  };
}

// Fetch published blogs (with fallback to local seed data)
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured || !supabase) {
    return BLOG_POSTS;
  }

  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return BLOG_POSTS;
    }

    return data.map(formatDbPost);
  } catch (err) {
    console.error('Error fetching blogs from Supabase, falling back to local:', err);
    return BLOG_POSTS;
  }
}

// Fetch single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured || !supabase) {
    const local = BLOG_POSTS.find((p) => p.slug === slug);
    return local || null;
  }

  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const local = BLOG_POSTS.find((p) => p.slug === slug);
      return local || null;
    }

    return formatDbPost(data);
  } catch (err) {
    console.error('Error fetching blog post by slug:', err);
    const local = BLOG_POSTS.find((p) => p.slug === slug);
    return local || null;
  }
}

// Fetch all posts for admin (including unpublished)
export async function getAdminBlogPosts(): Promise<DbBlogPost[]> {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    // Return local posts converted to DB format
    return BLOG_POSTS.map((p, index) => ({
      id: `local-${index}`,
      slug: p.slug,
      title: p.title,
      category: p.category,
      read_time: p.readTime,
      published_at: p.date,
      author: p.author,
      image: p.image,
      image_alt: p.imageAlt,
      excerpt: p.excerpt,
      content: p.content.join('\n\n'),
      is_published: true,
      created_at: new Date().toISOString(),
    }));
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin blogs:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Admin blogs fetch error:', err);
    return [];
  }
}
