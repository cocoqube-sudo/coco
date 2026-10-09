import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="text-[#c5d9ce] bg-[#052c1d] pt-16 pb-8">
      <div className="px-5 max-w-[76rem] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 mb-12">
          
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-flex items-center gap-3 text-white text-decoration-none">
              <div className="w-[2.8rem] h-[2.8rem] bg-white rounded-full flex items-center justify-center p-[0.2rem]">
                <Image src="/assets/cocoqube-logo.png" alt="CocoQube" width={40} height={40} className="object-contain" />
              </div>
              <strong className="text-[1.25rem] tracking-[0.12em] uppercase">CocoQube</strong>
            </Link>
            <p className="max-w-[29rem] text-[#c5d9ce]">
              Coco substrates and finished coir products for wholesale and export buyers. Bengaluru, India.
            </p>
          </div>

          <div>
            <div className="text-white font-[800] mb-3">Explore</div>
            <div className="grid gap-2">
              <Link href="/products" className="text-[#c5d9ce] hover:text-white transition-colors">Products</Link>
              <Link href="/industries" className="text-[#c5d9ce] hover:text-white transition-colors">Industries</Link>
              <Link href="/about" className="text-[#c5d9ce] hover:text-white transition-colors">About</Link>
              <Link href="/certifications" className="text-[#c5d9ce] hover:text-white transition-colors">Registrations</Link>
              <Link href="/blogs" className="text-[#c5d9ce] hover:text-white transition-colors">Blogs</Link>
              <Link href="/events" className="text-[#c5d9ce] hover:text-white transition-colors">Events</Link>
            </div>
          </div>

          <div>
            <div className="text-white font-[800] mb-3">Enquiries</div>
            <div className="grid gap-2">
              <Link href="/wholesale-enquiry" className="text-[#c5d9ce] hover:text-white transition-colors">Wholesale enquiry</Link>
              <Link href="/export-enquiry" className="text-[#c5d9ce] hover:text-white transition-colors">Export enquiry</Link>
              <Link href="/contact" className="text-[#c5d9ce] hover:text-white transition-colors">Contact</Link>
              <a href="https://wa.me/918714352330" target="_blank" rel="noopener noreferrer" className="text-[#c5d9ce] hover:text-white transition-colors">WhatsApp</a>
            </div>
          </div>

          <div>
            <div className="text-white font-[800] mb-3">Contact</div>
            <div className="grid gap-2">
              <a href="tel:+918714352330" className="text-[#c5d9ce] hover:text-white transition-colors">+91 87143 52330</a>
              <a href="https://www.cocoqube.com" target="_blank" rel="noopener noreferrer" className="text-[#c5d9ce] hover:text-white transition-colors">www.cocoqube.com</a>
              <span className="text-[#c5d9ce]">Bengaluru, India</span>
            </div>
          </div>
          
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-8 mt-8 border-t border-white/10 text-[#8fac9d] text-[0.85rem]">
          <span>© {new Date().getFullYear()} CocoQube.</span>
          <span>Specifications, HSN classification and availability are confirmed per order.</span>
        </div>
      </div>
    </footer>
  );
}
