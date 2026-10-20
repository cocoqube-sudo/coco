import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Please upload a valid image file (JPG, PNG, WebP, SVG, GIF)' }, { status: 400 });
    }

    // Limit size to 10MB
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: 'Image file size must be less than 10MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const ext = path.extname(file.name) || `.${file.type.split('/')[1] || 'jpg'}`;
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const uniqueFileName = `${baseName}-${Date.now()}${ext}`;

    // 1. Try uploading to Supabase Storage if configured
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const bucketName = 'blog-images';

        // Check or try uploading
        const { error: uploadError } = await supabaseAdmin.storage
          .from(bucketName)
          .upload(uniqueFileName, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicData } = supabaseAdmin.storage
            .from(bucketName)
            .getPublicUrl(uniqueFileName);

          if (publicData?.publicUrl) {
            return NextResponse.json({
              success: true,
              url: publicData.publicUrl,
              source: 'supabase',
              fileName: file.name,
            });
          }
        } else {
          // If bucket doesn't exist, try creating it
          if (uploadError.message?.toLowerCase().includes('not found') || (uploadError as any).statusCode === '404') {
            await supabaseAdmin.storage.createBucket(bucketName, { public: true });
            const { error: retryError } = await supabaseAdmin.storage
              .from(bucketName)
              .upload(uniqueFileName, buffer, {
                contentType: file.type,
                upsert: true,
              });

            if (!retryError) {
              const { data: publicData } = supabaseAdmin.storage
                .from(bucketName)
                .getPublicUrl(uniqueFileName);

              if (publicData?.publicUrl) {
                return NextResponse.json({
                  success: true,
                  url: publicData.publicUrl,
                  source: 'supabase',
                  fileName: file.name,
                });
              }
            }
          }
        }
      } catch (sbErr) {
        console.warn('Supabase storage upload bypassed, falling back to local storage:', sbErr);
      }
    }

    // 2. Fallback: Save to local public/uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, uniqueFileName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      source: 'local',
      fileName: file.name,
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    return NextResponse.json({ error: err.message || 'File upload failed' }, { status: 500 });
  }
}
