'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close nav on pathname change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" href="/" aria-label="Cocoqube home">
          <img
            className="mark"
            src="/images/logo-mark.png"
            alt="Cocoqube logo"
            width={40}
            height={40}
          />
          <strong>COCOQUBE</strong>
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
        <nav
          className={`site-nav ${open ? 'open' : ''}`}
          id="site-nav"
          aria-label="Primary navigation"
        >
          <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>
            Home
          </Link>
          <Link
            href="/coco-peat-blocks"
            aria-current={pathname?.startsWith('/coco-peat') && pathname !== '/coco-peat-enquiry' ? 'page' : undefined}
          >
            Coco peat
          </Link>
          <Link
            href="/products"
            aria-current={pathname === '/products' || pathname?.startsWith('/coir-') || pathname === '/hanging-basket-sets' ? 'page' : undefined}
          >
            Coir products
          </Link>
          <Link
            href="/export"
            aria-current={pathname === '/export' ? 'page' : undefined}
          >
            Export
          </Link>
          <Link
            href="/samples"
            aria-current={pathname === '/samples' ? 'page' : undefined}
          >
            Samples
          </Link>
          <Link
            href="/resources"
            aria-current={pathname?.startsWith('/resources') || pathname?.startsWith('/guide-') || pathname?.startsWith('/blogs') ? 'page' : undefined}
          >
            Resources
          </Link>
          <Link
            href="/about"
            aria-current={pathname === '/about' ? 'page' : undefined}
          >
            About
          </Link>
          <Link
            href="/contact"
            aria-current={pathname === '/contact' ? 'page' : undefined}
          >
            Contact
          </Link>
          <Link
            className="nav-cta"
            href="/coco-peat-enquiry"
            aria-current={pathname === '/coco-peat-enquiry' ? 'page' : undefined}
          >
            Request a quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
