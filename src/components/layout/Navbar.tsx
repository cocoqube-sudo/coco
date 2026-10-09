"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#063923f0] backdrop-blur-[16px]">
      <div className="flex items-center min-h-[5rem] gap-8 px-5 max-w-[76rem] mx-auto">
        <Link href="/" className="inline-flex items-center gap-3 text-white text-decoration-none" onClick={() => setIsMenuOpen(false)}>
          <div className="w-[2.8rem] h-[2.8rem] bg-white rounded-full flex items-center justify-center p-[0.2rem]">
             <Image src="/assets/cocoqube-logo.png" alt="CocoQube" width={40} height={40} className="object-contain" priority />
          </div>
          <strong className="text-[1.25rem] tracking-[0.12em] uppercase">CocoQube</strong>
        </Link>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-[1.2rem] ml-auto">
          <Link href="/" className="text-white/80 font-[600] text-[0.93rem] hover:text-white transition-colors" aria-current="page">Home</Link>
          <Link href="/products" className="text-white/80 font-[600] text-[0.93rem] hover:text-white transition-colors">Products</Link>
          <Link href="/industries" className="text-white/80 font-[600] text-[0.93rem] hover:text-white transition-colors">Industries</Link>
          <Link href="/about" className="text-white/80 font-[600] text-[0.93rem] hover:text-white transition-colors">About</Link>
          <Link href="/certifications" className="text-white/80 font-[600] text-[0.93rem] hover:text-white transition-colors">Registrations</Link>
          <Link href="/blogs" className="text-white/80 font-[600] text-[0.93rem] hover:text-white transition-colors">Blogs</Link>
          <Link href="/contact" className="text-white/80 font-[600] text-[0.93rem] hover:text-white transition-colors">Contact</Link>
          <Link href="/export-enquiry" className="text-white font-[600] text-[0.93rem] border border-white/30 rounded-full py-[0.55rem] px-4 hover:border-white transition-colors">
            Export enquiry
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button 
          className="md:hidden ml-auto text-white bg-transparent border border-white/25 rounded-[0.7rem] px-3 py-2 text-sm font-semibold"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
        >
          Menu
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <nav className="md:hidden absolute top-[5rem] left-0 right-0 p-4 bg-forest-deep flex flex-col items-stretch z-50 border-t border-white/10 shadow-lg">
          <Link href="/" className="text-white/80 font-[600] text-[0.93rem] py-2 border-b border-white/10" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/products" className="text-white/80 font-[600] text-[0.93rem] py-2 border-b border-white/10" onClick={() => setIsMenuOpen(false)}>Products</Link>
          <Link href="/industries" className="text-white/80 font-[600] text-[0.93rem] py-2 border-b border-white/10" onClick={() => setIsMenuOpen(false)}>Industries</Link>
          <Link href="/about" className="text-white/80 font-[600] text-[0.93rem] py-2 border-b border-white/10" onClick={() => setIsMenuOpen(false)}>About</Link>
          <Link href="/certifications" className="text-white/80 font-[600] text-[0.93rem] py-2 border-b border-white/10" onClick={() => setIsMenuOpen(false)}>Registrations</Link>
          <Link href="/blogs" className="text-white/80 font-[600] text-[0.93rem] py-2 border-b border-white/10" onClick={() => setIsMenuOpen(false)}>Blogs</Link>
          <Link href="/contact" className="text-white/80 font-[600] text-[0.93rem] py-2 border-b border-white/10" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          <Link href="/export-enquiry" className="text-white font-[600] text-[0.93rem] py-2" onClick={() => setIsMenuOpen(false)}>Export enquiry</Link>
        </nav>
      )}
    </header>
  );
}
