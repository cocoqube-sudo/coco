import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coir and Coco Peat Buyer Guides | Cocoqube",
  description: "Practical buyer guides on coco peat EC, RFQ checklists, basket liner sizing and export packing from Cocoqube.",
  openGraph: {
    title: "Coir and Coco Peat Buyer Guides | Cocoqube",
    description: "Practical buyer guides on coco peat EC, RFQ checklists, basket liner sizing and export packing from Cocoqube.",
    images: [{ url: "https://cocoqube.com/images/og/resources.jpg" }],
  },
  alternates: { canonical: "https://cocoqube.com/resources.html" },
};

const jsonLdData = [{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://cocoqube.com/"},{"@type":"ListItem","position":2,"name":"Resources"}]}];

const contentHtml = "\n<section class=\"page-hero\"><div class=\"container\"><nav class=\"breadcrumb\" aria-label=\"Breadcrumb\"><a href=\"/\">Home</a><span aria-hidden=\"true\">/</span><span aria-current=\"page\">Resources</span></nav><p class=\"eyebrow light\">Buyer intelligence</p><h1>Useful answers before the quotation</h1><p class=\"lede\">Short guides for importers, growers, retailers and distributors comparing coir products and preparing purchase requirements.</p></div></section>\n<section><div class=\"container\"><div class=\"grid-2\"><article class=\"card\"><span class=\"meta\">Product specification · 8 min</span><h3 style=\"margin:.4rem 0 .6rem\">Low EC and high EC coco peat: what buyers should compare</h3><p>Why processing labels alone are incomplete and which test details belong in an RFQ.</p><a class=\"text-link\" href=\"/guide-low-ec-vs-high-ec-coco-peat\">Read guide →</a></article><article class=\"card\"><span class=\"meta\">RFQ checklist · 7 min</span><h3 style=\"margin:.4rem 0 .6rem\">A coco peat substrate enquiry in eight details</h3><p>Crop, dimensions, blend, EC method, acceptance tests, packing, quantity and destination.</p><a class=\"text-link\" href=\"/guide-coco-peat-rfq-checklist\">Read guide →</a></article><article class=\"card\"><span class=\"meta\">Export planning · 8 min</span><h3 style=\"margin:.4rem 0 .6rem\">What to confirm before discussing export packing</h3><p>How specification, unit packs, labels and destination requirements affect the offer.</p><a class=\"text-link\" href=\"/guide-export-packing-checklist\">Read guide →</a></article><article class=\"card\"><span class=\"meta\">Buying guide · 7 min</span><h3 style=\"margin:.4rem 0 .6rem\">Basket liner sizing checklist for garden retailers</h3><p>Measure the frame, not the label, before you order a carton of liners.</p><a class=\"text-link\" href=\"/guide-coir-basket-liner-sizing\">Read guide →</a></article><article class=\"card\"><span class=\"meta\">Growing media · 8 min</span><h3 style=\"margin:.4rem 0 .6rem\">Coco peat versus peat moss: choosing a peat-free medium</h3><p>What changes when you move from peat moss to a peat-free coir medium.</p><a class=\"text-link\" href=\"/guide-coco-peat-vs-peat-moss\">Read guide →</a></article><article class=\"card\"><span class=\"meta\">Buying guide · 8 min</span><h3 style=\"margin:.4rem 0 .6rem\">Bulk coco peat blocks: how to compare quotes fairly</h3><p>Compare by expanded litre, grade and pack before you compare price per kilogram.</p><a class=\"text-link\" href=\"/guide-bulk-coco-peat-block-quotes\">Read guide →</a></article></div></div></section>\n<section><div class=\"narrow article\"><p class=\"eyebrow\">Start here</p><h2>Which guide should you read first?</h2><p>Buying coco peat for the first time? Start with the <a class=\"text-link\" href=\"/guide-coco-peat-rfq-checklist\">RFQ checklist</a>, then the <a class=\"text-link\" href=\"/guide-low-ec-vs-high-ec-coco-peat\">EC guide</a>. Comparing quotes for bulk coco peat? Read <a class=\"text-link\" href=\"/guide-bulk-coco-peat-block-quotes\">how to compare bulk quotes</a>. Moving from peat moss? Read <a class=\"text-link\" href=\"/guide-coco-peat-vs-peat-moss\">coco peat versus peat moss</a>. Buying liners? Use the <a class=\"text-link\" href=\"/guide-coir-basket-liner-sizing\">sizing checklist</a>. Shipping abroad? Use the <a class=\"text-link\" href=\"/guide-export-packing-checklist\">export packing checklist</a>.</p></div></section><div class=\"cta-band\"><div><p class=\"eyebrow light\">Need something specific?</p><h2>Ask us a buying question.</h2></div><div class=\"cta-actions\"><a class=\"button primary\" href=\"/contact\">Contact us</a><a class=\"button ghost\" href=\"/faq\">Read the FAQ</a></div></div>\n";

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
