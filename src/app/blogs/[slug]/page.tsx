import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/blogs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | Cocoqube",
    };
  }

  return {
    title: `${post.title} | Cocoqube Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
    alternates: { canonical: `https://cocoqube.com/blogs/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/resources">Resources</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blogs">Blog</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{post.category}</span>
          </nav>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: ".8rem" }}>
            <span className="eyebrow light" style={{ margin: 0 }}>{post.category}</span>
            <span style={{ color: "#afc7ba", fontSize: ".85rem" }}>· {post.readTime}</span>
            <span style={{ color: "#afc7ba", fontSize: ".85rem" }}>· {post.date}</span>
          </div>
          <h1 style={{ maxWidth: "26ch" }}>{post.title}</h1>
          <p className="lede">{post.excerpt}</p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="narrow article">
            <figure
              className="ph"
              style={{
                aspectRatio: "16/9",
                marginBottom: "2.5rem",
                borderRadius: "1.25rem",
              }}
              data-label={post.category}
              data-file={post.image}
            >
              <img
                src={post.image}
                alt={post.imageAlt}
                loading="eager"
                decoding="async"
              />
              <figcaption>{post.imageAlt}</figcaption>
            </figure>

            <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: "1.2rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".6rem" }}>
              <span className="fine">
                <strong>Author:</strong> {post.author}
              </span>
              <span className="fine">
                <strong>Location:</strong> Bengaluru, India
              </span>
            </div>

            {post.content.map((paragraph, index) => (
              <p key={index} style={{ fontSize: "1.08rem", lineHeight: "1.75" }}>
                {paragraph}
              </p>
            ))}

            <div className="callout" style={{ marginTop: "2.5rem" }}>
              <h3 style={{ margin: "0 0 .5rem", color: "var(--forest)" }}>Technical Takeaway</h3>
              <p style={{ margin: 0 }}>
                When ordering commercial coir substrates, never accept an unverified label claim. Require batch test certificates specifying extraction ratios, actual EC, and exchangeable sodium percentages.
              </p>
            </div>

            <div style={{ marginTop: "3rem", padding: "1.8rem", background: "#fff", border: "1px solid var(--line)", borderRadius: "1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.2rem" }}>
              <div>
                <h3 style={{ margin: "0 0 .3rem" }}>Have a technical question about your crop?</h3>
                <p className="fine" style={{ margin: 0 }}>Our agronomy desk can review your fertigation formula and substrate specs.</p>
              </div>
              <Link className="button dark" href="/contact">
                Enquire with our team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="alt" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Related Reading</p>
              <h2>Continue reading from our knowledge hub</h2>
            </div>
            <Link className="button outline" href="/blogs">
              View all articles
            </Link>
          </div>

          <div className="grid-2">
            {relatedPosts.map((related) => (
              <article key={related.slug} className="card">
                <span className="meta">{related.category} · {related.readTime}</span>
                <h3 style={{ margin: ".4rem 0 .6rem" }}>{related.title}</h3>
                <p>{related.excerpt}</p>
                <Link className="text-link" href={`/blogs/${related.slug}`}>
                  Read article →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
