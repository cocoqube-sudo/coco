'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DbBlogPost } from '@/lib/blogs';
import {
  saveBlogPost,
  deleteBlogPost,
  togglePublishStatus,
  seedInitialBlogs,
  logoutAdmin,
} from './actions';

interface Props {
  initialPosts: DbBlogPost[];
  isSupabaseConnected: boolean;
}

const PRESET_IMAGES = [
  { label: 'Quality Control / Lab', url: '/images/process-qc.jpg' },
  { label: 'Greenhouse Nursery', url: '/images/nursery.jpg' },
  { label: 'Export Pallets', url: '/images/export-pallet.jpg' },
  { label: 'Compressed Blocks', url: '/images/coco-peat-blocks.jpg' },
  { label: 'Expanded Coir Hydration', url: '/images/coco-peat-blocks-3.jpg' },
  { label: 'Factory Operations', url: '/images/about.jpg' },
];

export default function AdminDashboard({ initialPosts, isSupabaseConnected }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState<DbBlogPost[]>(initialPosts);
  const [editingPost, setEditingPost] = useState<DbBlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Cover Image upload states
  const [imageTab, setImageTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    slug: '',
    category: 'Substrate Chemistry',
    read_time: '5 min read',
    author: 'Cocoqube Technical Desk',
    image: '/images/process-qc.jpg',
    image_alt: '',
    excerpt: '',
    content: '',
    is_published: true,
  });

  const showStatus = (text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 6000);
  };

  const openNewModal = () => {
    setEditingPost(null);
    setImageTab('upload');
    setUploadError(null);
    setFormData({
      id: '',
      title: '',
      slug: '',
      category: 'Substrate Chemistry',
      read_time: '5 min read',
      author: 'Cocoqube Technical Desk',
      image: '/images/process-qc.jpg',
      image_alt: '',
      excerpt: '',
      content: '',
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (post: DbBlogPost) => {
    setEditingPost(post);
    setImageTab(post.image?.startsWith('/images/') ? 'preset' : post.image?.startsWith('http') ? 'url' : 'upload');
    setUploadError(null);
    setFormData({
      id: post.id || '',
      title: post.title,
      slug: post.slug,
      category: post.category,
      read_time: post.read_time,
      author: post.author,
      image: post.image,
      image_alt: post.image_alt,
      excerpt: post.excerpt,
      content: post.content,
      is_published: post.is_published,
    });
    setIsModalOpen(true);
  };

  const handleImageFile = async (file: File) => {
    if (!file) return;
    setUploadingImage(true);
    setUploadError(null);

    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({
          ...prev,
          image: data.url,
        }));
      } else {
        // Fallback to client Data URL so user is never blocked
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData((prev) => ({
            ...prev,
            image: e.target?.result as string,
          }));
        };
        reader.readAsDataURL(file);
        if (data.error) {
          setUploadError(data.error);
        }
      }
    } catch {
      // Fallback to client Data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      // Auto-generate slug if not editing an existing slug
      slug: prev.id ? prev.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      image_alt: prev.image_alt ? prev.image_alt : title,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await saveBlogPost(formData);
    setLoading(false);

    if (res.success) {
      showStatus(editingPost ? 'Article updated successfully!' : 'New article created and published!', 'success');
      setIsModalOpen(false);
      router.refresh();
    } else {
      showStatus(res.error || 'Failed to save article.', 'error');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this article?')) return;

    setLoading(true);
    const res = await deleteBlogPost(id);
    setLoading(false);

    if (res.success) {
      showStatus('Article deleted.', 'success');
      router.refresh();
    } else {
      showStatus(res.error || 'Could not delete article.', 'error');
    }
  };

  const handleTogglePublish = async (post: DbBlogPost) => {
    if (!post.id) return;
    const res = await togglePublishStatus(post.id, post.is_published);
    if (res.success) {
      showStatus(`Article marked as ${!post.is_published ? 'Published' : 'Draft'}.`, 'success');
      router.refresh();
    } else {
      showStatus(res.error || 'Could not update status.', 'error');
    }
  };

  const handleSeed = async () => {
    if (!confirm('Populate Supabase with the default Cocoqube technical articles?')) return;
    setLoading(true);
    const res = await seedInitialBlogs();
    setLoading(false);

    if (res.success) {
      showStatus(`Successfully seeded ${res.count} articles to Supabase!`, 'success');
      router.refresh();
    } else {
      showStatus(res.error || 'Failed to seed articles.', 'error');
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    router.refresh();
  };

  return (
    <main id="main" style={{ padding: '2rem 0 5rem' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.2rem', borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
              <h1 style={{ fontSize: '1.85rem' }}>Blog Content Manager</h1>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '.4rem',
                padding: '.25rem .75rem',
                borderRadius: '999px',
                fontSize: '.78rem',
                fontWeight: 700,
                background: isSupabaseConnected ? '#d4f4dd' : '#fff3d4',
                color: isSupabaseConnected ? '#063923' : '#8a5226',
                border: `1px solid ${isSupabaseConnected ? '#a8e5b9' : '#f5d898'}`,
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isSupabaseConnected ? '#10b981' : '#f59e0b' }}></span>
                {isSupabaseConnected ? 'Supabase Connected' : 'Supabase Config Needed'}
              </span>
            </div>
            <p className="fine" style={{ margin: '.3rem 0 0' }}>
              Publish, update, and manage technical agronomy articles displayed on <code>/resources</code> and <code>/blogs</code>.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
            <Link href="/blogs" className="button outline" target="_blank">
              View Public Blog ↗
            </Link>
            <button onClick={handleLogout} className="button ghost" style={{ color: 'var(--forest-ink)', borderColor: 'var(--line)' }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Status Alert Banner */}
        {statusMessage && (
          <div style={{
            padding: '1rem 1.4rem',
            borderRadius: '.8rem',
            marginBottom: '1.5rem',
            background: statusMessage.type === 'success' ? '#d4f4dd' : '#ffebe9',
            border: `1px solid ${statusMessage.type === 'success' ? '#a8e5b9' : '#ff8182'}`,
            color: statusMessage.type === 'success' ? '#063923' : '#c5221f',
            fontWeight: 600,
          }}>
            {statusMessage.text}
          </div>
        )}

        {/* Supabase Setup Helper Card (Shows when not connected) */}
        {!isSupabaseConnected && (
          <div style={{
            background: '#fff9ed',
            border: '1px solid #f2dbb3',
            borderRadius: '1.2rem',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}>
            <h3 style={{ color: '#8a5226', margin: '0 0 .5rem', fontSize: '1.1rem' }}>
              ⚡ Connect Your Supabase Project in 2 Steps
            </h3>
            <ol style={{ margin: '0 0 1rem', paddingLeft: '1.2rem', color: '#684521', fontSize: '.92rem', lineHeight: '1.6' }}>
              <li>
                Open your <strong>Supabase Dashboard</strong> → <strong>SQL Editor</strong>, and run the SQL schema located in <code style={{ background: '#f5ebe0', padding: '2px 6px', borderRadius: '4px' }}>supabase/schema.sql</code>.
              </li>
              <li>
                Add your <strong>Project URL</strong> and <strong>anon key</strong> into <code style={{ background: '#f5ebe0', padding: '2px 6px', borderRadius: '4px' }}>.env.local</code>:
                <pre style={{ background: '#2c2217', color: '#f3e8dc', padding: '.8rem 1rem', borderRadius: '.6rem', overflowX: 'auto', margin: '.5rem 0' }}>
{`NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
                </pre>
              </li>
            </ol>
            <span className="fine" style={{ color: '#8a5226' }}>
              Note: The site is currently serving the fallback seed articles from <code>src/data/blogs.ts</code> so nothing is broken.
            </span>
          </div>
        )}

        {/* Dashboard Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', margin: 0 }}>All Published Articles ({posts.length})</h2>
          </div>
          <div style={{ display: 'flex', gap: '.8rem' }}>
            {isSupabaseConnected && (
              <button
                onClick={handleSeed}
                className="button outline"
                disabled={loading}
                title="Populate Supabase with standard technical articles"
              >
                Sync Seed Articles to Supabase
              </button>
            )}
            <button onClick={openNewModal} className="button primary">
              + Write New Article
            </button>
          </div>
        </div>

        {/* Article Cards Grid */}
        <div className="grid-3" style={{ marginBottom: '3rem' }}>
          {posts.map((post) => (
            <article key={post.id || post.slug} className="card" style={{ position: 'relative' }}>
              <figure
                className="ph"
                style={{
                  aspectRatio: '16/9',
                  margin: '-.4rem -.4rem 1rem',
                  width: 'calc(100% + .8rem)',
                  borderRadius: '.8rem',
                }}
                data-label={post.category}
                data-file={post.image}
              >
                <img src={post.image} alt={post.image_alt || post.title} loading="lazy" />
              </figure>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.4rem' }}>
                <span className="meta">{post.category}</span>
                <span style={{
                  padding: '.2rem .5rem',
                  borderRadius: '999px',
                  fontSize: '.72rem',
                  fontWeight: 800,
                  background: post.is_published ? '#d4f4dd' : '#f3f4f6',
                  color: post.is_published ? '#063923' : '#6b7280',
                }}>
                  {post.is_published ? 'PUBLISHED' : 'DRAFT'}
                </span>
              </div>

              <h3 style={{ margin: '.3rem 0 .5rem', fontSize: '1.1rem' }}>{post.title}</h3>
              <p style={{ fontSize: '.88rem', lineClamp: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {post.excerpt}
              </p>

              <div className="fine" style={{ marginTop: 'auto', paddingTop: '.8rem', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{post.read_time}</span>
                <span>{post.published_at || 'Recent'}</span>
              </div>

              {/* Action buttons */}
              <div style={{ marginTop: '1rem', display: 'flex', gap: '.5rem' }}>
                <button
                  onClick={() => openEditModal(post)}
                  className="button outline"
                  style={{ flex: 1, minHeight: '2.4rem', padding: '.4rem .8rem', fontSize: '.85rem' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleTogglePublish(post)}
                  className="button ghost"
                  style={{ minHeight: '2.4rem', padding: '.4rem .8rem', fontSize: '.85rem', color: 'var(--forest-ink)', borderColor: 'var(--line)' }}
                >
                  {post.is_published ? 'Unpublish' : 'Publish'}
                </button>
                {post.id && !post.id.startsWith('local-') && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="button ghost"
                    style={{ minHeight: '2.4rem', padding: '.4rem .7rem', fontSize: '.85rem', color: '#c5221f', borderColor: '#ffd2d0' }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Modal / Article Editor */}
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6, 57, 35, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '1.4rem',
              width: 'min(54rem, 100%)',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: 'var(--shadow)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--line)' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
                  {editingPost ? 'Edit Blog Article' : 'Write New Blog Article'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: 'transparent', border: '0', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="field-grid">
                  <div className="field full">
                    <label>Article Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="e.g. The Chemistry of Washing & Buffering Coir Substrates"
                      required
                    />
                  </div>

                  <div className="field">
                    <label>URL Slug *</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. science-of-buffering-coco-peat"
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Substrate Chemistry">Substrate Chemistry</option>
                      <option value="Commercial Growing">Commercial Growing</option>
                      <option value="Export Logistics">Export Logistics</option>
                      <option value="Quality Control">Quality Control</option>
                      <option value="Agronomy & Science">Agronomy & Science</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Reading Time</label>
                    <input
                      type="text"
                      value={formData.read_time}
                      onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                      placeholder="e.g. 5 min read"
                    />
                  </div>

                  <div className="field">
                    <label>Author</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="e.g. Cocoqube Technical Desk"
                    />
                  </div>

                  <div className="field full">
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.4rem' }}>
                      <span style={{ fontWeight: 700 }}>Cover Image *</span>
                      <span className="fine" style={{ fontSize: '.78rem', color: 'var(--muted)' }}>
                        Pick from files, choose preset, or paste URL
                      </span>
                    </label>

                    {/* Source Selector Tabs */}
                    <div style={{ display: 'flex', gap: '.4rem', marginBottom: '.8rem', background: 'var(--sand)', padding: '.3rem', borderRadius: '.6rem' }}>
                      <button
                        type="button"
                        onClick={() => setImageTab('upload')}
                        style={{
                          flex: 1,
                          padding: '.5rem .8rem',
                          border: 0,
                          borderRadius: '.4rem',
                          fontSize: '.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: imageTab === 'upload' ? '#fff' : 'transparent',
                          color: imageTab === 'upload' ? 'var(--forest)' : 'var(--muted)',
                          boxShadow: imageTab === 'upload' ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '.4rem',
                          transition: 'all .15s ease',
                        }}
                      >
                        📁 Choose from Files
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageTab('preset')}
                        style={{
                          flex: 1,
                          padding: '.5rem .8rem',
                          border: 0,
                          borderRadius: '.4rem',
                          fontSize: '.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: imageTab === 'preset' ? '#fff' : 'transparent',
                          color: imageTab === 'preset' ? 'var(--forest)' : 'var(--muted)',
                          boxShadow: imageTab === 'preset' ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '.4rem',
                          transition: 'all .15s ease',
                        }}
                      >
                        🖼️ Factory Presets
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageTab('url')}
                        style={{
                          flex: 1,
                          padding: '.5rem .8rem',
                          border: 0,
                          borderRadius: '.4rem',
                          fontSize: '.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: imageTab === 'url' ? '#fff' : 'transparent',
                          color: imageTab === 'url' ? 'var(--forest)' : 'var(--muted)',
                          boxShadow: imageTab === 'url' ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '.4rem',
                          transition: 'all .15s ease',
                        }}
                      >
                        🔗 Image Link / URL
                      </button>
                    </div>

                    {/* TAB 1: Upload from Files */}
                    {imageTab === 'upload' && (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageFile(file);
                          }}
                        />
                        <div
                          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                          onDragLeave={() => setDragActive(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragActive(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleImageFile(file);
                          }}
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            border: `2px dashed ${dragActive ? 'var(--forest)' : '#cbd5e1'}`,
                            borderRadius: '.8rem',
                            padding: '1.6rem 1rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: dragActive ? 'var(--pale)' : '#fdfcfb',
                            transition: 'all .2s ease',
                          }}
                        >
                          <div style={{ fontSize: '2rem', marginBottom: '.4rem' }}>
                            {uploadingImage ? '⏳' : '📥'}
                          </div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '.95rem', color: 'var(--forest)' }}>
                            {uploadingImage ? 'Uploading image from files...' : 'Click to select an image from your device'}
                          </p>
                          <p className="fine" style={{ margin: '.3rem 0 0', color: 'var(--muted)', fontSize: '.8rem' }}>
                            Or drag & drop any JPG, PNG, WebP, GIF, or SVG image file here
                          </p>
                        </div>
                        {uploadError && (
                          <p style={{ color: '#c5221f', fontSize: '.82rem', marginTop: '.4rem' }}>⚠️ {uploadError}</p>
                        )}
                      </div>
                    )}

                    {/* TAB 2: Presets */}
                    {imageTab === 'preset' && (
                      <div>
                        <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', marginBottom: '.6rem' }}>
                          {PRESET_IMAGES.map((img) => (
                            <button
                              key={img.url}
                              type="button"
                              onClick={() => setFormData({ ...formData, image: img.url })}
                              style={{
                                padding: '.4rem .85rem',
                                borderRadius: '999px',
                                fontSize: '.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                border: formData.image === img.url ? '2px solid var(--forest)' : '1px solid var(--line)',
                                background: formData.image === img.url ? 'var(--pale)' : '#fff',
                                color: formData.image === img.url ? 'var(--forest)' : 'var(--forest-ink)',
                                transition: 'all .15s ease',
                              }}
                            >
                              {img.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB 3: Custom URL */}
                    {imageTab === 'url' && (
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="Paste image link (e.g. https://... or /images/process-qc.jpg)"
                        required
                      />
                    )}

                    {/* Preview of Selected Image */}
                    {formData.image && (
                      <div style={{
                        marginTop: '.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '.6rem .8rem',
                        borderRadius: '.7rem',
                        background: '#f8fafc',
                        border: '1px solid var(--line)',
                      }}>
                        <div style={{
                          width: '68px',
                          height: '50px',
                          borderRadius: '.5rem',
                          overflow: 'hidden',
                          background: '#e2e8f0',
                          flexShrink: 0,
                          border: '1px solid rgba(0,0,0,.08)'
                        }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={formData.image}
                            alt="Selected cover preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/process-qc.jpg';
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: '.84rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--forest-ink)' }}>
                            {formData.image.startsWith('data:') ? 'Custom file uploaded from device (Ready)' : formData.image}
                          </p>
                          <span className="fine" style={{ fontSize: '.75rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '.3rem', marginTop: '.1rem' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
                            Ready to publish
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (imageTab === 'upload') {
                              fileInputRef.current?.click();
                            } else {
                              setFormData({ ...formData, image: '' });
                            }
                          }}
                          className="button ghost"
                          style={{ padding: '.35rem .75rem', fontSize: '.78rem', minHeight: 'auto', borderColor: 'var(--line)' }}
                        >
                          {imageTab === 'upload' ? 'Change File' : 'Clear'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="field full">
                    <label>Summary / Excerpt (Displayed on Cards) *</label>
                    <textarea
                      rows={2}
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief overview explaining the practical insight for commercial growers..."
                      required
                    />
                  </div>

                  <div className="field full">
                    <label>Article Content (Separate paragraphs with double Enter) *</label>
                    <textarea
                      rows={8}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your article paragraphs here. You can separate paragraphs with a blank line..."
                      required
                    />
                  </div>

                  <div className="field full" style={{ display: 'flex', alignItems: 'center', gap: '.6rem', margin: '1rem 0' }}>
                    <input
                      id="publish-toggle"
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      style={{ width: '1.2rem', height: '1.2rem', minHeight: 'auto' }}
                    />
                    <label htmlFor="publish-toggle" style={{ margin: 0, cursor: 'pointer' }}>
                      Publish article immediately (visible on live website)
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid var(--line)' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="button ghost"
                    style={{ color: 'var(--forest-ink)', borderColor: 'var(--line)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="button primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : editingPost ? 'Update Article' : 'Publish Article'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
