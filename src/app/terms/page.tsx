import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Cocoqube",
  description: "Terms for using the Cocoqube website and for the product and specification information provided on it, including how quotes and specifications apply.",
  openGraph: {
    title: "Terms of Use | Cocoqube",
    description: "Terms for using the Cocoqube website and for the product and specification information provided on it, including how quotes and specifications apply.",
    images: [{ url: "https://cocoqube.com/images/og/terms.jpg" }],
  },
  alternates: { canonical: "https://cocoqube.com/terms" },
};

const jsonLdData = [{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://cocoqube.com/"},{"@type":"ListItem","position":2,"name":"Terms"}]}];

const contentHtml = "\n<section class=\"page-hero\"><div class=\"container\"><nav class=\"breadcrumb\" aria-label=\"Breadcrumb\"><a href=\"/\">Home</a><span aria-hidden=\"true\">/</span><span aria-current=\"page\">Terms</span></nav><h1>Terms of use</h1></div></section>\n<section><div class=\"narrow article\"><p class=\"meta\">Last updated 16 October 2026</p>\n<p>This is a plain-language summary and should be reviewed by a qualified adviser before you rely on it as a legal document.</p>\n<h2>Information on this website</h2><p>Product descriptions, sizes and formats are indicative and, where noted, supplier-stated. Specifications, availability, minimum order quantities, lead times and prices are confirmed in a written quotation or proforma invoice.</p>\n<h2>No offer until confirmed</h2><p>Nothing on this website is a binding offer. An order is accepted only when specification, payment terms and supply conditions are confirmed in writing.</p>\n<h2>Regulatory information</h2><p>Statements about import or export requirements are general. Importers should confirm classification, duties and destination conditions with the relevant authority or their broker.</p>\n<h2>Technical results</h2><p>Crop and growing results depend on water, management and conditions beyond our control. We commit to agreed product specifications, not to plant yield.</p>\n<h2>Links</h2><p>We are not responsible for the content of external websites linked from this site.</p>\n<h2>Who we are</h2><p>This website is operated by ZIPMERC LLP, trading as Cocoqube, GSTIN 29AADFZ7085R1ZY, IEC AADFZ7085R.</p></div></section>\n";

export default function Page() {
  return (
    <>
      {jsonLdData.map((data, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <main id="main" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </>
  );
}
