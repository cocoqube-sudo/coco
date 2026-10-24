import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Cocoqube",
  description: "How the Cocoqube website handles enquiry information, including what is collected, what is not stored and how to contact us about it.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Privacy Policy | Cocoqube",
    description: "How the Cocoqube website handles enquiry information, including what is collected, what is not stored and how to contact us about it.",
    images: [{ url: "https://cocoqube.com/images/og/privacy.jpg" }],
  },
  alternates: { canonical: "https://cocoqube.com/privacy" },
};

const jsonLdData = [{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://cocoqube.com/"},{"@type":"ListItem","position":2,"name":"Privacy"}]}];

const contentHtml = "\n<section class=\"page-hero\"><div class=\"container\"><nav class=\"breadcrumb\" aria-label=\"Breadcrumb\"><a href=\"/\">Home</a><span aria-hidden=\"true\">/</span><span aria-current=\"page\">Privacy</span></nav><h1>Privacy policy</h1></div></section>\n<section><div class=\"narrow article\"><p class=\"meta\">Last updated 16 October 2026</p>\n<p>This site is a business-to-business information website. This is a plain-language summary and should be reviewed by a qualified adviser before you rely on it as a legal document.</p>\n<h2>What this website collects</h2><p>The enquiry forms do not store your answers on our servers. When you submit a form, your message opens in WhatsApp for you to review and send, or you can copy it into an email. We receive the information only when you send it.</p>\n<h2>How we use enquiry details</h2><p>We use the business and contact details you send to respond to your enquiry, prepare quotations and samples, and keep records of the commercial relationship.</p>\n<h2>Analytics</h2><p>If analytics is enabled, we may use aggregate usage data, such as pages viewed and button clicks, to improve the site.</p>\n<h2>Your choices</h2><p>Tell us if you do not want follow-up messages and we will stop. Ask us to correct or delete your contact details at any time using the contact details on this site.</p>\n<h2>Contact</h2><p>Cocoqube is operated by ZIPMERC LLP, Property no. 224, 80/3, K R Puram Hobli, Old Madras Road, Bengaluru, Karnataka 560016, India. Email info@cocoqube.com, WhatsApp or phone +91 87143 52330.</p></div></section>\n";

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
