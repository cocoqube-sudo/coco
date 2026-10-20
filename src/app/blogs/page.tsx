import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Coco Coir & Agronomy Blog | Cocoqube",
  description: "Explore technical publications on coco peat buffering chemistry, customized air-filled porosity for commercial berries, and ocean freight logistics.",
  openGraph: {
    title: "Coco Coir & Agronomy Blog | Cocoqube",
    description: "Explore technical publications on coco peat buffering chemistry, customized air-filled porosity for commercial berries, and ocean freight logistics.",
    images: [{ url: "https://cocoqube.com/images/og/resources.jpg" }],
  },
  alternates: { canonical: "https://cocoqube.com/blogs" },
};

export default async function BlogsPage() {
  const posts = await getBlogPosts();

  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/resources">Resources</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Blog</span>
          </nav>
          <p className="eyebrow light">Technical Publications</p>
          <h1>Coco Coir & Substrate Knowledge Hub</h1>
          <p className="lede">
            In-depth articles written by our agronomy and export logistics desk in Bengaluru. Research, practical substrate management, and international shipping insights.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Published Articles</p>
              <h2>Latest Agronomy & Sourcing Insights</h2>
            </div>
            <p>
              Every article focuses on real commercial specifications, laboratory testing standards, and field-tested practices for commercial horticulture.
            </p>
          </div>

          <div className="grid-3">
            {posts.map((post) => (
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
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".4rem" }}>
                  <span className="meta">{post.category}</span>
                  <span className="fine" style={{ fontSize: ".78rem" }}>{post.readTime}</span>
                </div>
                <h3 style={{ margin: ".3rem 0 .6rem" }}>
                  <Link href={`/blogs/${post.slug}`} style={{ textDecoration: "none" }}>
                    {post.title}
                  </Link>
                </h3>
                <p>{post.excerpt}</p>
                <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="fine" style={{ fontSize: ".8rem", color: "var(--muted)" }}>{post.date}</span>
                  <Link className="text-link" href={`/blogs/${post.slug}`}>
                    Read article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="alt" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="container split">
          <div>
            <p className="eyebrow">Technical Support</p>
            <h2>Need a tailored substrate specification?</h2>
            <p className="lede dark">
              Whether you need specific EC levels, buffering with calcium nitrate, or a custom pith-to-chip ratio for your crop, our agronomy partners formulate to your exact brief.
            </p>
            <div style={{ display: "flex", gap: ".8rem", marginTop: "1.5rem" }}>
              <Link className="button dark" href="/coco-peat-enquiry">
                Request a custom spec quote
              </Link>
              <Link className="button outline" href="/resources">
                View all buyer guides
              </Link>
            </div>
          </div>
          <div>
            <div className="panel">
              <h3>Specification parameters we confirm</h3>
              <ul className="check-list">
                <li>Electrical Conductivity (EC) range and testing extraction method</li>
                <li>pH range (tested in demineralized water)</li>
                <li>Sieve grade (fine pith, coarse grade, or husks)</li>
                <li>Air-filled porosity (AFP) percentage target</li>
                <li>Compression ratio and verified dry expansion volume</li>
                <li>Moisture basis and destination fumigation certificates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="cta-band">
        <div>
          <p className="eyebrow light">Direct contact</p>
          <h2>Discuss your crop substrate requirement.</h2>
        </div>
        <div className="cta-actions">
          <Link className="button primary" href="/contact">
            Contact our desk
          </Link>
          <Link className="button ghost" href="/samples">
            Order a sample block
          </Link>
        </div>
      </div>
    </main>
  );
}
