import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const SOURCE_DIR = 'C:/Users/jasil/OneDrive/Desktop/cocoqube-website-blocks';
const TARGET_APP_DIR = path.resolve('src/app');

// Ensure source exists
if (!fs.existsSync(SOURCE_DIR)) {
  console.error('Source directory does not exist:', SOURCE_DIR);
  process.exit(1);
}

const htmlFiles = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.html'));

console.log(`Found ${htmlFiles.length} HTML files.`);

for (const file of htmlFiles) {
  const filePath = path.join(SOURCE_DIR, file);
  const rawHtml = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(rawHtml);

  const title = $('title').text() || 'Cocoqube | Sustainable Coir Solutions';
  const description = $('meta[name="description"]').attr('content') || '';
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const ogTitle = $('meta[property="og:title"]').attr('content') || title;
  const ogDesc = $('meta[property="og:description"]').attr('content') || description;
  const ogImage = $('meta[property="og:image"]').attr('content') || 'https://cocoqube.com/images/og/index.jpg';

  // Extract JSON-LD scripts
  const jsonLd = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).html());
      jsonLd.push(parsed);
    } catch (e) {
      // ignore
    }
  });

  // Extract <main id="main"> content
  const $main = $('main#main');
  if ($main.length === 0) {
    console.warn(`No <main id="main"> found in ${file}`);
    continue;
  }

  // Remove any inline scripts inside main (like calculator script, which we handle separately)
  $main.find('script').remove();

  // Rewrite URLs inside main:
  // 1. href="index.html" -> href="/"
  // 2. href="foo.html" -> href="/foo"
  // 3. href="foo.html#bar" -> href="/foo#bar"
  $main.find('a[href]').each((_, el) => {
    let href = $(el).attr('href');
    if (href === 'index.html') {
      $(el).attr('href', '/');
    } else if (href.includes('.html')) {
      href = href.replace(/([a-zA-Z0-9_-]+)\.html(#?.*)/, '/$1$2');
      $(el).attr('href', href);
    }
  });

  // Rewrite image sources to start with leading slash
  $main.find('img[src]').each((_, el) => {
    const src = $(el).attr('src');
    if (src && !src.startsWith('/') && !src.startsWith('http')) {
      $(el).attr('src', '/' + src);
    }
  });

  $main.find('[data-file]').each((_, el) => {
    const df = $(el).attr('data-file');
    if (df && !df.startsWith('/') && !df.startsWith('http')) {
      $(el).attr('data-file', '/' + df);
    }
  });

  const mainHtml = $main.html() || '';

  // Determine target directory and filename
  let targetFile;
  if (file === 'index.html') {
    targetFile = path.join(TARGET_APP_DIR, 'page.tsx');
  } else if (file === '404.html') {
    targetFile = path.join(TARGET_APP_DIR, 'not-found.tsx');
  } else {
    const routeName = file.replace('.html', '');
    const routeDir = path.join(TARGET_APP_DIR, routeName);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    targetFile = path.join(routeDir, 'page.tsx');
  }

  // Generate page component code
  const isNotFound = file === '404.html';
  const pageCode = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: ${JSON.stringify(title)},
  description: ${JSON.stringify(description)},
  openGraph: {
    title: ${JSON.stringify(ogTitle)},
    description: ${JSON.stringify(ogDesc)},
    images: [{ url: ${JSON.stringify(ogImage)} }],
  },
  ${canonical ? `alternates: { canonical: ${JSON.stringify(canonical)} },` : ''}
};

const jsonLdData = ${JSON.stringify(jsonLd)};

const contentHtml = ${JSON.stringify(mainHtml)};

export default function ${isNotFound ? 'NotFound' : 'Page'}() {
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
`;

  fs.writeFileSync(targetFile, pageCode, 'utf8');
  console.log(`Generated ${targetFile}`);
}

console.log('Finished generating all 32 pages!');
