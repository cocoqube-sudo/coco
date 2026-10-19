import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand" href="/">
              <img
                className="mark"
                src="/images/logo-mark.png"
                alt="Cocoqube logo"
                width={40}
                height={40}
              />
              <strong>COCOQUBE</strong>
            </Link>
            <p>
              Coir products and coco substrates for nurseries, garden brands, landscapers, distributors and importers. Based in Bengaluru, India.
            </p>
            <p>
              <a href="mailto:info@cocoqube.com">info@cocoqube.com</a>
            </p>
          </div>
          <div>
            <div className="footer-title">Products</div>
            <div className="footer-links">
              <Link href="/coco-peat-blocks">Coco peat blocks</Link>
              <Link href="/coco-peat-for-growers">For growers</Link>
              <Link href="/coco-peat-retail-packs">Retail packs</Link>
              <Link href="/coco-peat-export">Block export</Link>
              <Link href="/coco-peat-calculator">Block calculator</Link>
              <Link href="/coir-basket-liners">Basket liners</Link>
              <Link href="/coir-pots-seedling-cups">Pots and cups</Link>
              <Link href="/hanging-basket-sets">Hanging sets</Link>
              <Link href="/coir-mulch-discs">Mulch discs</Link>
              <Link href="/coir-support-poles">Support poles</Link>
            </div>
          </div>
          <div>
            <div className="footer-title">Buyers</div>
            <div className="footer-links">
              <Link href="/nursery-supplies">Nursery supply</Link>
              <Link href="/private-label">Private label</Link>
              <Link href="/export">Export</Link>
              <Link href="/samples">Paid samples</Link>
              <Link href="/wholesale-enquiry">Wholesale enquiry</Link>
              <Link href="/export-enquiry">Export enquiry</Link>
            </div>
          </div>
          <div>
            <div className="footer-title">Company</div>
            <div className="footer-links">
              <Link href="/about">About</Link>
              <Link href="/resources">Resources</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/contact">Contact</Link>
              <a href="https://wa.me/918714352330">WhatsApp</a>
              <a href="tel:+918714352330">+91 87143 52330</a>
              <span>Property no. 224, 80/3, K R Puram Hobli, Old Madras Road, Bengaluru, Karnataka 560016</span>
            </div>
          </div>
        </div>
        <div className="footer-legal">
          <span>ZIPMERC LLP, trading as Cocoqube</span>
          <span>GSTIN 29AADFZ7085R1ZY · IEC AADFZ7085R</span>
        </div>
        <div className="footer-bottom">
          <span>
            Copyright © 2026 Cocoqube (ZIPMERC LLP) | All Rights Reserved.{' '}
            <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link>
          </span>
          <span>Specifications and availability are confirmed per enquiry.</span>
        </div>
      </div>
    </footer>
  );
}
