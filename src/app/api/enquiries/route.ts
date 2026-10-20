import { NextRequest, NextResponse } from 'next/server';
import { getEnquiries, saveEnquiry, updateEnquiryStatus, deleteEnquiry } from '@/lib/enquiries';
import { checkAdminAuth } from '@/app/admin/actions';

// POST: Public submission from any enquiry form on the site
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await saveEnquiry({
      form_type: body.form_type || 'contact',
      name: body.name || body['Name'] || body['Full name'] || 'Anonymous',
      company: body.company || body['Company'] || '',
      phone: body.phone || body['Phone / WhatsApp'] || body['Phone or WhatsApp'] || '',
      email: body.email || body['Business email'] || body['Email'] || '',
      city: body.city || body['Delivery city'] || body['City / country'] || body['Destination port / city'] || '',
      country: body.country || body['Country'] || '',
      product: body.product || body['Product'] || body['Kit'] || '',
      quantity: body.quantity || body['Required quantity'] || body['Estimated quantity'] || body['Quantity'] || '',
      details: body.details || body,
      status: 'new',
    });

    return NextResponse.json({ success: true, id: res.id });
  } catch (err: any) {
    console.error('Failed to capture enquiry:', err);
    return NextResponse.json({ error: err.message || 'Failed to save enquiry' }, { status: 500 });
  }
}

// GET: List all enquiries (Admin protected)
export async function GET() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const list = await getEnquiries();
  return NextResponse.json({ success: true, enquiries: list });
}

// PATCH: Update status
export async function PATCH(req: NextRequest) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const res = await updateEnquiryStatus(id, status);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Remove an enquiry
export async function DELETE(req: NextRequest) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const res = await deleteEnquiry(id);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
