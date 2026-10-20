import { promises as fs } from 'fs';
import path from 'path';
import { supabaseAdmin, isSupabaseConfigured } from './supabase';

export interface ClientEnquiry {
  id: string;
  created_at: string;
  form_type: string;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  city?: string;
  country?: string;
  product?: string;
  quantity?: string;
  details?: Record<string, string>;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  notes?: string;
}

const LOCAL_ENQUIRIES_PATH = path.join(process.cwd(), 'src', 'data', 'enquiries.json');

// Helper to read local JSON fallback
async function readLocalEnquiries(): Promise<ClientEnquiry[]> {
  try {
    const data = await fs.readFile(LOCAL_ENQUIRIES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper to write local JSON fallback
async function writeLocalEnquiries(enquiries: ClientEnquiry[]): Promise<void> {
  try {
    const dir = path.dirname(LOCAL_ENQUIRIES_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(LOCAL_ENQUIRIES_PATH, JSON.stringify(enquiries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local enquiries backup:', err);
  }
}

export async function getEnquiries(): Promise<ClientEnquiry[]> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data as ClientEnquiry[];
      }
    } catch {
      // Supabase table may not exist yet, fallback to local file
    }
  }

  return readLocalEnquiries();
}

export async function saveEnquiry(payload: Partial<ClientEnquiry>): Promise<{ success: boolean; id?: string; error?: string }> {
  const enquiry: ClientEnquiry = {
    id: payload.id || `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: payload.created_at || new Date().toISOString(),
    form_type: payload.form_type || 'contact',
    name: payload.name || 'Anonymous Buyer',
    company: payload.company || '',
    phone: payload.phone || '',
    email: payload.email || '',
    city: payload.city || '',
    country: payload.country || '',
    product: payload.product || '',
    quantity: payload.quantity || '',
    details: payload.details || {},
    status: payload.status || 'new',
    notes: payload.notes || '',
  };

  let savedToSupabase = false;

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('enquiries')
        .insert([{
          form_type: enquiry.form_type,
          name: enquiry.name,
          company: enquiry.company,
          phone: enquiry.phone,
          email: enquiry.email,
          city: enquiry.city,
          country: enquiry.country,
          product: enquiry.product,
          quantity: enquiry.quantity,
          details: enquiry.details,
          status: enquiry.status,
          notes: enquiry.notes,
        }])
        .select('id')
        .single();

      if (!error && data?.id) {
        enquiry.id = data.id;
        savedToSupabase = true;
      }
    } catch (sbErr) {
      console.warn('Supabase insert failed, saving to local backup:', sbErr);
    }
  }

  // Always keep a local copy as backup
  const current = await readLocalEnquiries();
  const updated = [enquiry, ...current.filter((e) => e.id !== enquiry.id)];
  await writeLocalEnquiries(updated);

  return { success: true, id: enquiry.id };
}

export async function updateEnquiryStatus(id: string, status: ClientEnquiry['status']): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from('enquiries')
        .update({ status })
        .eq('id', id);

      if (!error) {
        // Also update local copy
        const current = await readLocalEnquiries();
        const updated = current.map((e) => (e.id === id ? { ...e, status } : e));
        await writeLocalEnquiries(updated);
        return { success: true };
      }
    } catch {
      // Fall through to local update
    }
  }

  const current = await readLocalEnquiries();
  const updated = current.map((e) => (e.id === id ? { ...e, status } : e));
  await writeLocalEnquiries(updated);
  return { success: true };
}

export async function deleteEnquiry(id: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('enquiries').delete().eq('id', id);
    } catch {}
  }

  const current = await readLocalEnquiries();
  const updated = current.filter((e) => e.id !== id);
  await writeLocalEnquiries(updated);
  return { success: true };
}
