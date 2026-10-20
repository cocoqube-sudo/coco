'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DbBlogPost } from '@/lib/blogs';
import { ClientEnquiry } from '@/lib/enquiries';
import {
  saveBlogPost,
  deleteBlogPost,
  togglePublishStatus,
  seedInitialBlogs,
  updateLeadStatus,
  deleteLead,
  logoutAdmin,
} from './actions';

interface Props {
  initialPosts: DbBlogPost[];
  initialEnquiries?: ClientEnquiry[];
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

export default function AdminDashboard({ initialPosts, initialEnquiries = [], isSupabaseConnected }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Top Level Navigation
  const [activeTab, setActiveTab] = useState<'blogs' | 'enquiries'>('enquiries');

  // Posts State
  const [posts, setPosts] = useState<DbBlogPost[]>(initialPosts);
  const [editingPost, setEditingPost] = useState<DbBlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Enquiries State
  const [enquiries, setEnquiries] = useState<ClientEnquiry[]>(initialEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ClientEnquiry | null>(null);
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryFilterType, setEnquiryFilterType] = useState('all');
  const [enquiryFilterStatus, setEnquiryFilterStatus] = useState('all');

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

  // Blog helpers
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
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData((prev) => ({
            ...prev,
            image: e.target?.result as string,
          }));
        };
        reader.readAsDataURL(file);
        if (data.error) setUploadError(data.error);
      }
    } catch {
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

  // Enquiry Helpers
  const handleUpdateLeadStatus = async (id: string, status: ClientEnquiry['status']) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    const res = await updateLeadStatus(id, status);
    if (res.success) {
      showStatus(`Enquiry status changed to "${status}".`, 'success');
      router.refresh();
    } else {
      showStatus(res.error || 'Failed to update status.', 'error');
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client enquiry?')) return;
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
    const res = await deleteLead(id);
    if (res.success) {
      showStatus('Enquiry deleted.', 'success');
      router.refresh();
    } else {
      showStatus(res.error || 'Failed to delete enquiry.', 'error');
    }
  };

  const exportEnquiriesCsv = () => {
    const headers = ['Date', 'Form Type', 'Name', 'Company', 'Phone', 'Email', 'City', 'Country', 'Product', 'Quantity', 'Status'];
    const rows = enquiries.map((e) => [
      new Date(e.created_at).toLocaleDateString(),
      e.form_type,
      `"${(e.name || '').replace(/"/g, '""')}"`,
      `"${(e.company || '').replace(/"/g, '""')}"`,
      `"${(e.phone || '').replace(/"/g, '""')}"`,
      `"${(e.email || '').replace(/"/g, '""')}"`,
      `"${(e.city || '').replace(/"/g, '""')}"`,
      `"${(e.country || '').replace(/"/g, '""')}"`,
      `"${(e.product || '').replace(/"/g, '""')}"`,
      `"${(e.quantity || '').replace(/"/g, '""')}"`,
      e.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cocoqube_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    router.refresh();
  };

  // Filtered Enquiries
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      !enquirySearch ||
      e.name.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      (e.company && e.company.toLowerCase().includes(enquirySearch.toLowerCase())) ||
      (e.email && e.email.toLowerCase().includes(enquirySearch.toLowerCase())) ||
      (e.phone && e.phone.includes(enquirySearch)) ||
      (e.product && e.product.toLowerCase().includes(enquirySearch.toLowerCase()));

    const matchesType = enquiryFilterType === 'all' || e.form_type === enquiryFilterType;
    const matchesStatus = enquiryFilterStatus === 'all' || e.status === enquiryFilterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  return (
    <main id="main" style={{ padding: '2rem 0 5rem' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.8rem', paddingBottom: '1.2rem', borderBottom: '1px solid var(--line)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
              <h1 style={{ fontSize: '1.85rem', margin: 0 }}>Cocoqube Admin</h1>
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
                {isSupabaseConnected ? 'Supabase Connected' : 'Local Storage Mode'}
              </span>
            </div>
            <p className="fine" style={{ margin: '.3rem 0 0' }}>
              Manage commercial buyer enquiries, RFQs, and technical blog articles.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
            <Link href="/" className="button outline" target="_blank" style={{ fontSize: '.84rem' }}>
              View Website ↗
            </Link>
            <button onClick={handleLogout} className="button ghost" style={{ color: 'var(--forest-ink)', borderColor: 'var(--line)', fontSize: '.84rem' }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--line)', marginBottom: '2rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('enquiries')}
            style={{
              padding: '.8rem 1.4rem',
              background: 'transparent',
              border: 0,
              borderBottom: activeTab === 'enquiries' ? '3px solid var(--forest)' : '3px solid transparent',
              fontWeight: 700,
              fontSize: '1rem',
              color: activeTab === 'enquiries' ? 'var(--forest)' : 'var(--muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '.6rem',
              marginBottom: '-2px',
              transition: 'all .15s ease',
            }}
          >
            📬 Client Enquiries & RFQs
            <span style={{
              background: newEnquiriesCount > 0 ? '#10b981' : 'var(--sand)',
              color: newEnquiriesCount > 0 ? '#fff' : 'var(--forest-ink)',
              fontSize: '.74rem',
              padding: '.15rem .5rem',
              borderRadius: '999px',
              fontWeight: 700,
            }}>
              {enquiries.length} {newEnquiriesCount > 0 && `(${newEnquiriesCount} New)`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('blogs')}
            style={{
              padding: '.8rem 1.4rem',
              background: 'transparent',
              border: 0,
              borderBottom: activeTab === 'blogs' ? '3px solid var(--forest)' : '3px solid transparent',
              fontWeight: 700,
              fontSize: '1rem',
              color: activeTab === 'blogs' ? 'var(--forest)' : 'var(--muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '.6rem',
              marginBottom: '-2px',
              transition: 'all .15s ease',
            }}
          >
            📰 Blog Articles
            <span style={{
              background: 'var(--sand)',
              color: 'var(--forest-ink)',
              fontSize: '.74rem',
              padding: '.15rem .5rem',
              borderRadius: '999px',
              fontWeight: 700,
            }}>
              {posts.length}
            </span>
          </button>
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

        {/* ======================================================== */}
        {/* TAB 1: CLIENT ENQUIRIES & LEADS                          */}
        {/* ======================================================== */}
        {activeTab === 'enquiries' && (
          <div>
            {/* Quick KPI Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '1rem', border: '1px solid var(--line)', boxShadow: '0 1px 3px rgba(0,0,0,.03)' }}>
                <span className="fine" style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: '.75rem', fontWeight: 700 }}>Total Leads</span>
                <p style={{ fontSize: '1.8rem', fontWeight: 800, margin: '.2rem 0 0', color: 'var(--forest)' }}>{enquiries.length}</p>
              </div>

              <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '1rem', border: '1px solid #a8e5b9', boxShadow: '0 1px 3px rgba(0,0,0,.03)' }}>
                <span className="fine" style={{ color: '#047857', textTransform: 'uppercase', fontSize: '.75rem', fontWeight: 700 }}>New & Uncontacted</span>
                <p style={{ fontSize: '1.8rem', fontWeight: 800, margin: '.2rem 0 0', color: '#047857' }}>{newEnquiriesCount}</p>
              </div>

              <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '1rem', border: '1px solid var(--line)', boxShadow: '0 1px 3px rgba(0,0,0,.03)' }}>
                <span className="fine" style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: '.75rem', fontWeight: 700 }}>Export RFQs</span>
                <p style={{ fontSize: '1.8rem', fontWeight: 800, margin: '.2rem 0 0', color: 'var(--forest-ink)' }}>
                  {enquiries.filter((e) => e.form_type === 'export').length}
                </p>
              </div>

              <div style={{ background: '#fff', padding: '1.2rem', borderRadius: '1rem', border: '1px solid var(--line)', boxShadow: '0 1px 3px rgba(0,0,0,.03)' }}>
                <span className="fine" style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: '.75rem', fontWeight: 700 }}>Wholesale & Block Quotes</span>
                <p style={{ fontSize: '1.8rem', fontWeight: 800, margin: '.2rem 0 0', color: 'var(--forest-ink)' }}>
                  {enquiries.filter((e) => e.form_type === 'wholesale' || e.form_type === 'block').length}
                </p>
              </div>
            </div>

            {/* Controls Bar: Search, Filters, CSV Export */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', background: '#faf9f6', padding: '1rem 1.2rem', borderRadius: '1rem', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', flexWrap: 'wrap', flex: 1 }}>
                <input
                  type="text"
                  placeholder="🔍 Search by name, company, email..."
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  style={{ minWidth: '220px', maxWidth: '320px', background: '#fff' }}
                />

                <select
                  value={enquiryFilterType}
                  onChange={(e) => setEnquiryFilterType(e.target.value)}
                  style={{ background: '#fff', width: 'auto' }}
                >
                  <option value="all">All Form Types</option>
                  <option value="export">Export RFQs</option>
                  <option value="wholesale">Wholesale Enquiries</option>
                  <option value="block">Coco Peat Block Quotes</option>
                  <option value="sample">Sample Kit Requests</option>
                  <option value="contact">General Contact</option>
                </select>

                <select
                  value={enquiryFilterStatus}
                  onChange={(e) => setEnquiryFilterStatus(e.target.value)}
                  style={{ background: '#fff', width: 'auto' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New (Uncontacted)</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="closed">Closed / Deal Won</option>
                </select>
              </div>

              <button
                type="button"
                onClick={exportEnquiriesCsv}
                className="button outline"
                style={{ fontSize: '.84rem', background: '#fff' }}
              >
                📥 Export Leads to CSV
              </button>
            </div>

            {/* Enquiries List */}
            {filteredEnquiries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', border: '1px dashed var(--line)', borderRadius: '1.2rem' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--muted)', margin: 0 }}>
                  No customer enquiries match your filter.
                </p>
                <p className="fine" style={{ margin: '.5rem 0 0' }}>
                  When visitors submit wholesale, export, sample or block forms on your site, they will automatically appear here!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    style={{
                      background: '#fff',
                      border: enquiry.status === 'new' ? '1.5px solid #10b981' : '1px solid var(--line)',
                      borderRadius: '1rem',
                      padding: '1.4rem',
                      boxShadow: '0 1px 4px rgba(0,0,0,.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      position: 'relative',
                    }}
                  >
                    {/* Top Row: Client Name, Company, Date, Type Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '.8rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--forest)' }}>
                            {enquiry.name}
                          </h3>
                          {enquiry.company && (
                            <span style={{ fontWeight: 600, color: 'var(--forest-ink)', fontSize: '.95rem' }}>
                              • {enquiry.company}
                            </span>
                          )}
                          <span style={{
                            fontSize: '.72rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            padding: '.2rem .6rem',
                            borderRadius: '999px',
                            background: 'var(--sand)',
                            color: 'var(--forest-ink)',
                          }}>
                            {enquiry.form_type}
                          </span>
                        </div>
                        <p className="fine" style={{ margin: '.2rem 0 0', color: 'var(--muted)', fontSize: '.8rem' }}>
                          Received: {new Date(enquiry.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          {(enquiry.city || enquiry.country) && ` • ${[enquiry.city, enquiry.country].filter(Boolean).join(', ')}`}
                        </p>
                      </div>

                      {/* Status Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                        <select
                          value={enquiry.status}
                          onChange={(e) => handleUpdateLeadStatus(enquiry.id, e.target.value as any)}
                          style={{
                            fontSize: '.82rem',
                            fontWeight: 700,
                            padding: '.35rem .8rem',
                            borderRadius: '999px',
                            width: 'auto',
                            border: '1px solid',
                            borderColor:
                              enquiry.status === 'new' ? '#10b981' :
                              enquiry.status === 'contacted' ? '#3b82f6' :
                              enquiry.status === 'quoted' ? '#f59e0b' : '#9ca3af',
                            background:
                              enquiry.status === 'new' ? '#ecfdf5' :
                              enquiry.status === 'contacted' ? '#eff6ff' :
                              enquiry.status === 'quoted' ? '#fffbeb' : '#f3f4f6',
                            color:
                              enquiry.status === 'new' ? '#047857' :
                              enquiry.status === 'contacted' ? '#1d4ed8' :
                              enquiry.status === 'quoted' ? '#b45309' : '#4b5563',
                          }}
                        >
                          <option value="new">● New Lead</option>
                          <option value="contacted">● Contacted</option>
                          <option value="quoted">● Quote Sent</option>
                          <option value="closed">● Closed / Won</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleDeleteLead(enquiry.id)}
                          style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--muted)', fontSize: '1rem', padding: '.3rem' }}
                          title="Delete Lead"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Middle Row: Product Requirement Details */}
                    <div style={{ background: '#faf9f6', padding: '1rem', borderRadius: '.8rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '.8rem' }}>
                      <div>
                        <span className="fine" style={{ color: 'var(--muted)', fontSize: '.75rem', fontWeight: 700, display: 'block' }}>REQUESTED PRODUCT</span>
                        <span style={{ fontWeight: 600, fontSize: '.92rem', color: 'var(--forest-ink)' }}>{enquiry.product || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="fine" style={{ color: 'var(--muted)', fontSize: '.75rem', fontWeight: 700, display: 'block' }}>ESTIMATED QUANTITY</span>
                        <span style={{ fontWeight: 600, fontSize: '.92rem', color: 'var(--forest-ink)' }}>{enquiry.quantity || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="fine" style={{ color: 'var(--muted)', fontSize: '.75rem', fontWeight: 700, display: 'block' }}>PHONE / WHATSAPP</span>
                        <span style={{ fontWeight: 600, fontSize: '.92rem', color: 'var(--forest-ink)' }}>{enquiry.phone || '—'}</span>
                      </div>
                      <div>
                        <span className="fine" style={{ color: 'var(--muted)', fontSize: '.75rem', fontWeight: 700, display: 'block' }}>BUSINESS EMAIL</span>
                        <span style={{ fontWeight: 600, fontSize: '.92rem', color: 'var(--forest-ink)' }}>{enquiry.email || '—'}</span>
                      </div>
                    </div>

                    {/* Bottom Row: Quick Reply Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.8rem', paddingTop: '.6rem', borderTop: '1px solid var(--line)' }}>
                      <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
                        {enquiry.phone && (
                          <a
                            href={`https://wa.me/${enquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${enquiry.name}, thank you for contacting Cocoqube regarding ${enquiry.product || 'coir substrates'}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button primary"
                            style={{ padding: '.4rem .9rem', fontSize: '.82rem', minHeight: 'auto' }}
                          >
                            💬 Reply on WhatsApp
                          </a>
                        )}

                        {enquiry.email && (
                          <a
                            href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`Cocoqube Quotation: ${enquiry.product || 'Inquiry'}`)}&body=${encodeURIComponent(`Dear ${enquiry.name},\n\nThank you for reaching out to Cocoqube.\n\nBest regards,\nCocoqube Export Desk`)}`}
                            className="button outline"
                            style={{ padding: '.4rem .9rem', fontSize: '.82rem', minHeight: 'auto' }}
                          >
                            ✉️ Send Email
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="button ghost"
                          style={{ padding: '.4rem .9rem', fontSize: '.82rem', minHeight: 'auto', borderColor: 'var(--line)' }}
                        >
                          🔍 View All Form Details
                        </button>
                      </div>

                      <span className="fine" style={{ fontSize: '.78rem', color: 'var(--muted)' }}>
                        ID: <code>{enquiry.id.slice(0, 16)}</code>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal: View Full Enquiry Technical Details */}
            {selectedEnquiry && (
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
                  width: 'min(48rem, 100%)',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  padding: '2rem',
                  boxShadow: 'var(--shadow)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--line)' }}>
                    <div>
                      <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Client RFQ Full Details</h2>
                      <p className="fine" style={{ margin: '.2rem 0 0' }}>
                        Submitted via <strong>/{selectedEnquiry.form_type}</strong> form on {new Date(selectedEnquiry.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedEnquiry(null)}
                      style={{ background: 'transparent', border: '0', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: '#faf9f6', padding: '.8rem 1rem', borderRadius: '.6rem' }}>
                      <span className="fine" style={{ fontSize: '.75rem', color: 'var(--muted)', fontWeight: 700 }}>CLIENT NAME</span>
                      <p style={{ margin: '.2rem 0 0', fontWeight: 700, fontSize: '1.05rem', color: 'var(--forest)' }}>{selectedEnquiry.name}</p>
                    </div>
                    <div style={{ background: '#faf9f6', padding: '.8rem 1rem', borderRadius: '.6rem' }}>
                      <span className="fine" style={{ fontSize: '.75rem', color: 'var(--muted)', fontWeight: 700 }}>COMPANY</span>
                      <p style={{ margin: '.2rem 0 0', fontWeight: 600 }}>{selectedEnquiry.company || '—'}</p>
                    </div>
                    <div style={{ background: '#faf9f6', padding: '.8rem 1rem', borderRadius: '.6rem' }}>
                      <span className="fine" style={{ fontSize: '.75rem', color: 'var(--muted)', fontWeight: 700 }}>PHONE / WHATSAPP</span>
                      <p style={{ margin: '.2rem 0 0', fontWeight: 600 }}>{selectedEnquiry.phone || '—'}</p>
                    </div>
                    <div style={{ background: '#faf9f6', padding: '.8rem 1rem', borderRadius: '.6rem' }}>
                      <span className="fine" style={{ fontSize: '.75rem', color: 'var(--muted)', fontWeight: 700 }}>BUSINESS EMAIL</span>
                      <p style={{ margin: '.2rem 0 0', fontWeight: 600 }}>{selectedEnquiry.email || '—'}</p>
                    </div>
                  </div>

                  {/* All Form Fields Breakdown */}
                  <h4 style={{ margin: '1.5rem 0 .8rem', fontSize: '1.05rem', color: 'var(--forest)' }}>All Submitted Form Fields:</h4>
                  <div style={{ background: '#fdfcfb', border: '1px solid var(--line)', borderRadius: '.8rem', overflow: 'hidden' }}>
                    {Object.entries(selectedEnquiry.details || {}).map(([key, val], idx) => (
                      <div
                        key={key}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(140px, 1fr) 2fr',
                          gap: '1rem',
                          padding: '.75rem 1rem',
                          borderBottom: '1px solid var(--line)',
                          background: idx % 2 === 0 ? '#fff' : '#faf9f6',
                          fontSize: '.88rem',
                        }}
                      >
                        <span style={{ fontWeight: 700, color: 'var(--forest-ink)' }}>{key}</span>
                        <span style={{ color: '#2c2217', wordBreak: 'break-word' }}>
                          {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedEnquiry(null)}
                      className="button primary"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: BLOG ARTICLES MANAGER                             */}
        {/* ======================================================== */}
        {activeTab === 'blogs' && (
          <div>
            {/* Dashboard Actions Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Published Articles</span>
                <span className="fine" style={{ background: 'var(--sand)', padding: '.2rem .6rem', borderRadius: '999px', fontWeight: 700 }}>
                  {posts.length} Total
                </span>
              </div>

              <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleSeed}
                  disabled={loading}
                  className="button outline"
                  style={{ fontSize: '.85rem' }}
                >
                  ⚡ Seed 3 Agronomy Articles
                </button>
                <button
                  onClick={openNewModal}
                  className="button primary"
                  style={{ fontSize: '.85rem' }}
                >
                  + Write New Article
                </button>
              </div>
            </div>

            {/* Articles Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))', gap: '1.5rem' }}>
              {posts.map((post) => (
                <article
                  key={post.id || post.slug}
                  style={{
                    background: '#fff',
                    borderRadius: '1.2rem',
                    border: '1px solid var(--line)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'var(--shadow)',
                  }}
                >
                  {/* Card Cover Image */}
                  <div style={{ position: 'relative', height: '12rem', width: '100%', background: '#e0e0e0', overflow: 'hidden' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image || '/images/process-qc.jpg'}
                      alt={post.image_alt || post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/process-qc.jpg';
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      top: '.8rem',
                      left: '.8rem',
                      padding: '.25rem .7rem',
                      borderRadius: '999px',
                      fontSize: '.72rem',
                      fontWeight: 700,
                      background: 'rgba(6, 57, 35, 0.85)',
                      color: '#fff',
                      backdropFilter: 'blur(4px)',
                    }}>
                      {post.category}
                    </span>

                    <span style={{
                      position: 'absolute',
                      top: '.8rem',
                      right: '.8rem',
                      padding: '.25rem .6rem',
                      borderRadius: '999px',
                      fontSize: '.72rem',
                      fontWeight: 700,
                      background: post.is_published ? '#d4f4dd' : '#ffebe9',
                      color: post.is_published ? '#063923' : '#c5221f',
                      border: `1px solid ${post.is_published ? '#a8e5b9' : '#ff8182'}`,
                    }}>
                      {post.is_published ? '● Published' : '○ Draft'}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.15rem', lineHeight: '1.35', margin: '0 0 .6rem' }}>
                      {post.title}
                    </h3>
                    <p className="fine" style={{
                      color: 'var(--forest-ink)',
                      margin: '0 0 1rem',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {post.excerpt}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.78rem', color: 'var(--muted)', paddingTop: '.8rem', borderTop: '1px solid var(--line)', marginBottom: '1rem' }}>
                      <span>{post.read_time}</span>
                      <span>{post.published_at}</span>
                    </div>

                    {/* Card Actions */}
                    <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                      <Link
                        href={`/blogs/${post.slug}`}
                        target="_blank"
                        className="button outline"
                        style={{ flex: 1, padding: '.45rem .6rem', fontSize: '.8rem', textAlign: 'center', minHeight: 'auto' }}
                      >
                        View ↗
                      </Link>
                      <button
                        onClick={() => openEditModal(post)}
                        className="button outline"
                        style={{ flex: 1, padding: '.45rem .6rem', fontSize: '.8rem', minHeight: 'auto' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className="button ghost"
                        style={{ padding: '.45rem .6rem', fontSize: '.8rem', minHeight: 'auto', color: 'var(--forest-ink)' }}
                      >
                        {post.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="button ghost"
                        style={{ padding: '.45rem .6rem', fontSize: '.8rem', minHeight: 'auto', color: '#c5221f' }}
                      >
                        Delete
                      </button>
                    </div>
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
        )}
      </div>
    </main>
  );
}
