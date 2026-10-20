'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const WHATSAPP_NUMBER = '918714352330';
const BUSINESS_EMAIL = 'info@cocoqube.com';

export default function SiteInteractivity() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Photo missing placeholder
    document.querySelectorAll('figure.ph img').forEach((imgEl) => {
      const img = imgEl as HTMLImageElement;
      const miss = () => img.closest('figure')?.classList.add('missing');
      img.addEventListener('error', miss);
      if (img.complete && img.naturalWidth === 0) miss();
    });

    // 2. Coco Peat Calculator
    const v = document.getElementById('c-vol') as HTMLInputElement | null;
    const f = document.getElementById('c-fmt') as HTMLSelectElement | null;
    const o = document.getElementById('c-out');

    if (v && f && o) {
      const updateCalc = () => {
        const L = parseFloat(v.value) || 0;
        const p = f.value.split('|');
        const e = parseFloat(p[0]);
        const k = parseFloat(p[1]);
        const n = Math.ceil(L / e);
        const w = n * k;
        o.innerHTML =
          '<h3>' +
          n.toLocaleString('en-IN') +
          ' blocks</h3><p>Total dry weight about ' +
          (Math.round(w * 100) / 100).toLocaleString('en-IN') +
          ' kg (' +
          (Math.round(w / 10) / 100).toLocaleString('en-IN') +
          ' tonnes).</p><p class="fine">Based on supplier-stated expansion of about ' +
          e +
          ' litres per block. Pack and pallet counts are confirmed per specification.</p>';
      };

      v.addEventListener('input', updateCalc);
      f.addEventListener('change', updateCalc);
      updateCalc();
    }

    // 3. Enquiry Forms
    const buildMessage = (form: HTMLFormElement) => {
      const kinds: Record<string, string> = {
        export: 'export enquiry',
        wholesale: 'wholesale enquiry',
        contact: 'general enquiry / meeting request',
        sample: 'sample kit request',
      };
      const kind = kinds[form.dataset.form || ''] || 'enquiry';
      const lines = ['Hello Cocoqube, I would like to submit a ' + kind + '.', ''];
      new FormData(form).forEach((value, key) => {
        const clean = String(value).trim();
        if (clean) lines.push(key + ': ' + clean);
      });
      lines.push('', 'Please confirm the next information required for evaluation.');
      return lines.join('\n');
    };

    const setStatus = (form: HTMLFormElement, text: string) => {
      const status = form.querySelector('.form-status');
      if (!status) return;
      status.textContent = text;
      status.classList.add('show');
    };

    const saveLead = (form: HTMLFormElement) => {
      try {
        const formData = new FormData(form);
        const data: Record<string, any> = {
          form_type: form.dataset.form || 'contact',
        };
        formData.forEach((value, key) => {
          data[key] = String(value).trim();
        });

        fetch('/api/enquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).catch(() => {});
      } catch {}
    };

    document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
      const emailBtn = form.querySelector<HTMLButtonElement>('[data-action="email"]');
      if (emailBtn && !BUSINESS_EMAIL) emailBtn.hidden = true;

      // Handle submit (WhatsApp)
      form.onsubmit = (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        saveLead(form);
        const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(buildMessage(form));
        setStatus(form, 'Your enquiry has been received and opened on WhatsApp ready to send.');
        window.open(url, '_blank', 'noopener,noreferrer');
      };

      // Handle action buttons (email & copy)
      form.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((btn) => {
        btn.onclick = () => {
          if (!form.reportValidity()) return;
          saveLead(form);
          const text = buildMessage(form);
          if (btn.dataset.action === 'email' && BUSINESS_EMAIL) {
            const subject = 'Cocoqube ' + (form.dataset.form || 'enquiry');
            window.location.href =
              'mailto:' + BUSINESS_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
          } else if (btn.dataset.action === 'copy') {
            const done = () => setStatus(form, 'Enquiry saved and copied to clipboard.');
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(text).then(done, () =>
                setStatus(form, 'Copy was blocked by your browser. Please use the WhatsApp button.')
              );
            } else {
              setStatus(form, 'Copy is not supported here. Please use the WhatsApp button.');
            }
          }
        };
      });

      // Prefill product from ?product=
      const wanted = new URLSearchParams(window.location.search).get('product');
      if (wanted) {
        const select = form.querySelector<HTMLSelectElement>('select[name="Product"]');
        if (select) {
          Array.from(select.options).forEach((opt) => {
            if (opt.text.trim().toLowerCase() === wanted.trim().toLowerCase()) {
              select.value = opt.value || opt.text;
            }
          });
        }
      }
    });
  }, [pathname]);

  return null;
}
