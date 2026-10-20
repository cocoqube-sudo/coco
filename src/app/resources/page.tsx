import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Coir & Coco Peat Buyer Guides & Technical Blog | Cocoqube",
  description: "Practical buyer guides and technical blog articles on coco peat EC, buffering chemistry, AFP porosity, RFQ checklists, and export logistics from Cocoqube.",
  openGraph: {
    title: "Coir & Coco Peat Buyer Guides & Technical Blog | Cocoqube",
    description: "Practical buyer guides and technical blog articles on coco peat EC, buffering chemistry, AFP porosity, RFQ checklists, and export logistics from Cocoqube.",
    images: [{ url: "https://cocoqube.com/images/og/resources.jpg" }],
  },
  alternates: { canonical: "https://cocoqube.com/resources.html" },
};

export default async function ResourcesPage() {
  const blogs = await getBlogPosts();
  const featuredBlogs = blogs.slice(0, 3);

  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Resources</span>
          </nav>
          <p className="eyebrow light">Buyer intelligence & Knowledge Hub</p>
          <h1>Useful answers before the quotation</h1>
          <p className="lede">
            Short guides and technical articles for importers, commercial growers, retailers, and distributors comparing coir products and preparing purchase requirements.
          </p>
        </div>
      </section>

      {/* Technical Buyer Guides */}
      <section>
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Buyer Guides</p>
              <h2>Technical Specification & Sizing Guides</h2>
            </div>
            <p>Six focused guides detailing laboratory EC testing, grow-bag briefs, and packaging requirements.</p>
          </div>
          <div className="grid-2">
            <article className="card">
              <span className="meta">Product specification · 8 min</span>
              <h3 style={{ margin: ".4rem 0 .6rem" }}>Low EC and high EC coco peat: what buyers should compare</h3>
              <p>Why processing labels alone are incomplete and which test details belong in an RFQ.</p>
              <Link className="text-link" href="/guide-low-ec-vs-high-ec-coco-peat">Read guide →</Link>
            </article>
            <article className="card">
              <span className="meta">RFQ checklist · 7 min</span>
              <h3 style={{ margin: ".4rem 0 .6rem" }}>A coco peat substrate enquiry in eight details</h3>
              <p>Crop, dimensions, blend, EC method, acceptance tests, packing, quantity and destination.</p>
              <Link className="text-link" href="/guide-coco-peat-rfq-checklist">Read guide →</Link>
            </article>
            <article className="card">
              <span className="meta">Export planning · 8 min</span>
              <h3 style={{ margin: ".4rem 0 .6rem" }}>What to confirm before discussing export packing</h3>
              <p>How specification, unit packs, labels and destination requirements affect the offer.</p>
              <Link className="text-link" href="/guide-export-packing-checklist">Read guide →</Link>
            </article>
            <article className="card">
              <span className="meta">Buying guide · 7 min</span>
              <h3 style={{ margin: ".4rem 0 .6rem" }}>Basket liner sizing checklist for garden retailers</h3>
              <p>Measure the frame, not the label, before you order a carton of liners.</p>
              <Link className="text-link" href="/guide-coir-basket-liner-sizing">Read guide →</Link>
            </article>
            <article className="card">
              <span className="meta">Growing media · 8 min</span>
              <h3 style={{ margin: ".4rem 0 .6rem" }}>Coco peat versus peat moss: choosing a peat-free medium</h3>
              <p>What changes when you move from peat moss to a peat-free coir medium.</p>
              <Link className="text-link" href="/guide-coco-peat-vs-peat-moss">Read guide →</Link>
            </article>
            <article className="card">
              <span className="meta">Buying guide · 8 min</span>
              <h3 style={{ margin: ".4rem 0 .6rem" }}>Bulk coco peat blocks: how to compare quotes fairly</h3>
              <p>Compare by expanded litre, grade and pack before you compare price per kilogram.</p>
              <Link className="text-link" href="/guide-bulk-coco-peat-block-quotes">Read guide →</Link>
            </article>
          </div>
        </div>
      </section>

      {/* Blog Section (Connected to Supabase) */}
      <section className="alt" id="blog-section" style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Industry Articles & Blog</p>
              <h2>Technical Agronomy & Substrate Blog</h2>
            </div>
            <p>In-depth technical articles on buffering chemistry, air-filled porosity for soft fruit crops, and ocean freight logistics.</p>
          </div>

          <div className="grid-3">
            {featuredBlogs.map((post) => (
              <article key={post.slug} className="card">
                <figure
                  className="ph"
                  style={{
                    aspectRatio: "16/9",
                    margin: "-.4rem -.4rem 1.1rem",
                    width: "calc(100% + .8rem)",
                    borderRadius: ".9rem",
                  }}
                  data-label={post.category}
                  data-file={post.image}
                >
                  <img src={post.image} alt={post.imageAlt} loading="lazy" decoding="async" />
                </figure>
                <span className="meta">{post.category} · {post.readTime}</span>
                <h3 style={{ margin: ".4rem 0 .6rem" }}>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link className="text-link" href={`/blogs/${post.slug}`}>
                  Read full article →
                </Link>
              </article>
            ))}
          </div>

          <div style={{ marginTop: "2.2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <span className="fine">Published by the Cocoqube Technical Agronomy and Sourcing Desk in Bengaluru, India.</span>
            <div style={{ display: "flex", gap: ".8rem" }}>
              <Link className="button outline" href="/blogs">Explore all blog publications →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Start Here / Guide Selection */}
      <section>
        <div className="narrow article">
          <p className="eyebrow">Start here</p>
          <h2>Which guide should you read first?</h2>
          <p>
            Buying coco peat for the first time? Start with the <Link className="text-link" href="/guide-coco-peat-rfq-checklist">RFQ checklist</Link>, then the <Link className="text-link" href="/guide-low-ec-vs-high-ec-coco-peat">EC guide</Link>. Comparing quotes for bulk coco peat? Read <Link className="text-link" href="/guide-bulk-coco-peat-block-quotes">how to compare bulk quotes</Link>. Moving from peat moss? Read <Link className="text-link" href="/guide-coco-peat-vs-peat-moss">coco peat versus peat moss</Link>. Buying liners? Use the <Link className="text-link" href="/guide-coir-basket-liner-sizing">sizing checklist</Link>. Shipping abroad? Use the <Link className="text-link" href="/guide-export-packing-checklist">export packing checklist</Link>.
          </p>
        </div>
      </section>

      <div className="cta-band">
        <div>
          <p className="eyebrow light">Need something specific?</p>
          <h2>Ask us a buying question.</h2>
        </div>
        <div className="cta-actions">
          <Link className="button primary" href="/contact">Contact us</Link>
          <Link className="button ghost" href="/faq">Read the FAQ</Link>
        </div>
      </div>
    </main>
  );
}
