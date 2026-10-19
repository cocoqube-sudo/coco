import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Cocoqube",
  description: "This page could not be found. Return to the Cocoqube home page or browse coco peat blocks, coir products, export and contact pages.",
  openGraph: {
    title: "Page Not Found | Cocoqube",
    description: "This page could not be found. Return to the Cocoqube home page or browse coco peat blocks, coir products, export and contact pages.",
    images: [{ url: "https://cocoqube.com/images/og/404.jpg" }],
  },
  
};

const jsonLdData = [{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://cocoqube.com/"},{"@type":"ListItem","position":2,"name":"Not found"}]}];

const contentHtml = "\n<section class=\"page-hero\"><div class=\"container\"><nav class=\"breadcrumb\" aria-label=\"Breadcrumb\"><a href=\"/\">Home</a><span aria-hidden=\"true\">/</span><span aria-current=\"page\">Not found</span></nav><h1>The page has moved or does not exist</h1><p class=\"lede\">Try one of these instead.</p></div></section>\n<section><div class=\"container\"><div class=\"hero-actions\"><a class=\"button dark\" href=\"/\">Return home</a><a class=\"button outline\" href=\"/products\">Products</a><a class=\"button outline\" href=\"/resources\">Resources</a><a class=\"button outline\" href=\"/contact\">Contact us</a></div></div></section>\n";

export default function NotFound() {
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
