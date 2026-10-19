import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Cocoqube | Bengaluru Coir Supplier",
  description: "Contact Cocoqube in Bengaluru by WhatsApp, phone or email, or book an online buyer meeting to review products, samples and documentation.",
  openGraph: {
    title: "Contact Cocoqube | Bengaluru Coir Supplier",
    description: "Contact Cocoqube in Bengaluru by WhatsApp, phone or email, or book an online buyer meeting to review products, samples and documentation.",
    images: [{ url: "https://cocoqube.com/images/og/contact.jpg" }],
  },
  alternates: { canonical: "https://cocoqube.com/contact.html" },
};

const jsonLdData = [{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://cocoqube.com/"},{"@type":"ListItem","position":2,"name":"Contact"}]},{"@context":"https://schema.org","@type":"ContactPage","name":"Contact Cocoqube | Bengaluru Coir Supplier","url":"https://cocoqube.com/contact.html","about":{"@id":"https://cocoqube.com/#organization"},"isPartOf":{"@type":"WebSite","name":"Cocoqube","url":"https://cocoqube.com/"}}];

const contentHtml = "\n<section class=\"page-hero\"><div class=\"container\"><nav class=\"breadcrumb\" aria-label=\"Breadcrumb\"><a href=\"/\">Home</a><span aria-hidden=\"true\">/</span><span aria-current=\"page\">Contact</span></nav><p class=\"eyebrow light\">Contact</p><h1>Talk to Cocoqube</h1><p class=\"lede\">Reach us by WhatsApp or phone, or request a buyer meeting to review your product brief, samples and commercial pathway.</p></div></section>\n<section><div class=\"container form-layout\"><aside class=\"form-aside\"><p class=\"eyebrow\">Direct contact</p><h2>Reach us today</h2><ul class=\"check-list\"><li><a class=\"text-link\" href=\"https://wa.me/918714352330\">WhatsApp +91 87143 52330</a></li><li><a class=\"text-link\" href=\"tel:+918714352330\">Call +91 87143 52330</a></li><li>Property no. 224, 80/3, KR Puram Hobli, Old Madras Road, Bengaluru, Karnataka 560016</li><li><a class=\"text-link\" href=\"https://www.cocoqube.com\">www.cocoqube.com</a></li></ul><p class=\"fine\" style=\"margin-top:1rem\">Replies follow India Standard Time (UTC+5:30). No public trade-fair dates are confirmed. Appointments will be listed here only after they are booked.</p></aside>\n<form class=\"form-card\" data-form=\"contact\" novalidate=\"\"><div class=\"field-grid\"><div class=\"field\"><label for=\"f-name\">Name <span class=\"required\" aria-hidden=\"true\">*</span></label><input id=\"f-name\" name=\"Name\" type=\"text\" required=\"\" autocomplete=\"name\"></div><div class=\"field\"><label for=\"f-company\">Company <span class=\"required\" aria-hidden=\"true\">*</span></label><input id=\"f-company\" name=\"Company\" type=\"text\" required=\"\" autocomplete=\"organization\"></div><div class=\"field\"><label for=\"f-city-or-country\">City / country <span class=\"required\" aria-hidden=\"true\">*</span></label><input id=\"f-city-or-country\" name=\"City or country\" type=\"text\" required=\"\"></div><div class=\"field\"><label for=\"f-preferred-meeting-format\">Preferred format</label><select id=\"f-preferred-meeting-format\" name=\"Preferred meeting format\"><option>Video call</option><option>Phone call</option><option>In-person meeting (Bengaluru)</option></select></div><div class=\"field full\"><label for=\"f-products-and-meeting-objective\">Products and objective <span class=\"required\" aria-hidden=\"true\">*</span></label><textarea id=\"f-products-and-meeting-objective\" name=\"Products and meeting objective\" required=\"\"></textarea></div><div class=\"field full\"><label for=\"f-preferred-date-or-buying-timeline\">Preferred date or buying timeline</label><input id=\"f-preferred-date-or-buying-timeline\" name=\"Preferred date or buying timeline\" type=\"text\"></div></div>\n<div class=\"btn-row three\"><button class=\"button dark full\" type=\"submit\">Prepare message on WhatsApp</button><button class=\"button outline full\" type=\"button\" data-action=\"email\">Send by email</button><button class=\"button outline full\" type=\"button\" data-action=\"copy\">Copy enquiry text</button></div>\n<div class=\"form-status\" role=\"status\"></div>\n<p class=\"form-note\">This website does not store your form. WhatsApp opens with your enquiry ready to review and send, or copy the text into an email. Replies follow India Standard Time (UTC+5:30).</p></form></div></section><section><div class=\"narrow article\"><p class=\"eyebrow\">Before you write</p><h2>What to send us</h2><p>The fastest route to a useful reply is a short message with the product, size or grade, quantity, delivery pincode or destination port, and the date you need it. Use the <a class=\"text-link\" href=\"/coco-peat-enquiry\">coco peat block quote form</a>, the <a class=\"text-link\" href=\"/wholesale-enquiry\">wholesale form</a> or the <a class=\"text-link\" href=\"/export-enquiry\">export form</a>. We are in Bengaluru, India, and reply in India Standard Time (UTC+5:30). Browse <a class=\"text-link\" href=\"/resources\">buyer guides</a> or the <a class=\"text-link\" href=\"/faq\">FAQ</a> first if you are comparing options.</p></div></section>\n";

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
