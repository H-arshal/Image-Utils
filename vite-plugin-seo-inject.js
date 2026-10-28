/**
 * vite-plugin-seo-inject.js
 *
 * At build time, generates high-ranking, rich static HTML files for every route in TOOLS_SEO_DATA.
 * Both /dist/<route>.html and /dist/<route>/index.html are generated.
 *
 * Each generated page includes:
 *  - High-intent Title & Meta Description
 *  - Canonical tag pointing to the exact route URL
 *  - Complete OpenGraph & Twitter Cards
 *  - Schema.org BreadcrumbList structured data
 *  - Schema.org HowTo structured data (enables Google step-by-step rich snippet)
 *  - Schema.org FAQPage structured data (enables Google expandable FAQ rich snippet)
 *  - Pre-rendered semantic HTML (H1, 3-step guide, features list, FAQs, related tools, global footer)
 *
 * This turns Image Utils from a client-side SPA into a fully pre-rendered, high-authority site
 * that search engines (Googlebot, Bingbot, ClaudeBot, GPTBot, Perplexity) rank on top.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { TOOLS_SEO_DATA } from './src/data/toolsSeoContent.js';

const ORIGIN = 'https://www.image-utils.site';

/**
 * Generate semantic HTML for the tool guide & FAQ section
 */
function buildToolHtmlBody(tool) {
  const stepsHtml = (tool.steps || [])
    .map(
      (step, idx) => `
        <div class="tool-step-card">
          <div class="tool-step-number">${idx + 1}</div>
          <h3 class="tool-step-title">${step.name}</h3>
          <p class="tool-step-text">${step.text}</p>
        </div>`
    )
    .join('');

  const featuresHtml = (tool.features || [])
    .map(
      (feat) => `
        <li class="tool-feature-item">
          <span style="color: var(--color-success); font-weight: bold; margin-right: 6px;">✓</span>
          <span>${feat}</span>
        </li>`
    )
    .join('');

  const faqsHtml = (tool.faqs || [])
    .map(
      (faq) => `
        <div class="tool-faq-item is-open">
          <div class="tool-faq-question-btn">
            <h4 class="tool-faq-question-text" style="margin: 0; font-size: 0.9375rem;">${faq.q}</h4>
          </div>
          <div class="tool-faq-answer-content">
            <p>${faq.a}</p>
          </div>
        </div>`
    )
    .join('');

  const relatedHtml = (tool.related || [])
    .map((relId) => {
      const relTool = TOOLS_SEO_DATA[relId];
      if (!relTool) return '';
      return `<a href="/${relId}" class="tool-related-chip">${relTool.name} &rarr;</a>`;
    })
    .join('');

  return `
        <!-- Semantic Main Landmark for ${tool.name} -->
        <main id="main-content" class="main-content" role="main">
          <!-- Hero Section with Primary H1 -->
          <section class="hero-section" aria-labelledby="hero-title-h1">
            <h1 id="hero-title-h1" class="hero-title">${tool.h1}</h1>
            <p class="hero-subtitle">${tool.desc}</p>
          </section>

          <!-- Pre-rendered Tool Guide & Helpful Content (E-E-A-T) -->
          <section class="tool-guide-section" aria-labelledby="tool-guide-heading">
            <div class="tool-guide-container">
              <div class="tool-guide-header">
                <div class="tool-guide-badge">
                  <span>100% Private In-Browser Guide</span>
                </div>
                <h2 id="tool-guide-heading" class="tool-guide-title">
                  How to Use ${tool.name} Online
                </h2>
                <p class="tool-guide-subtitle">${tool.desc}</p>
              </div>

              <!-- 3-Step Guide Grid (HowTo) -->
              <div class="tool-steps-grid">
                ${stepsHtml}
              </div>

              <!-- Key Features -->
              <div class="tool-features-card">
                <div class="tool-features-header">
                  <h3 class="tool-features-title">Why Use Image Utils for ${tool.name}?</h3>
                </div>
                <ul class="tool-features-list">
                  ${featuresHtml}
                </ul>
              </div>

              <!-- Tool FAQs -->
              <div class="tool-faqs-wrapper">
                <div class="tool-faqs-header">
                  <h3 class="tool-faqs-title">Frequently Asked Questions</h3>
                </div>
                <div class="tool-faqs-list">
                  ${faqsHtml}
                </div>
              </div>

              <!-- Related Tools Quick Bar -->
              ${
                relatedHtml
                  ? `<div class="tool-related-section">
                      <span class="tool-related-label">Frequently Used Together:</span>
                      <div class="tool-related-links">
                        ${relatedHtml}
                      </div>
                    </div>`
                  : ''
              }
            </div>
          </section>
        </main>`;
}

/**
 * Generate Schema.org JSON-LD structured data for HowTo, FAQPage, and Breadcrumbs
 */
function buildStructuredDataJson(tool, canonicalUrl) {
  const schemas = [];

  // 1. BreadcrumbList
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${ORIGIN}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.name,
        item: canonicalUrl,
      },
    ],
  });

  // 2. HowTo Schema (triggers Google Step Carousels)
  if (tool.steps && tool.steps.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to Use ${tool.name} Online`,
      description: tool.desc,
      step: tool.steps.map((s, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        name: s.name,
        text: s.text,
      })),
    });
  }

  // 3. FAQPage Schema (triggers Google FAQ Rich Snippets)
  if (tool.faqs && tool.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    });
  }

  return `
    <!-- Schema.org Rich Snippets (Breadcrumb, HowTo, FAQPage) -->
    <script type="application/ld+json">
    ${JSON.stringify(schemas, null, 2)}
    </script>`;
}

/**
 * Replace the <head> and prerendered body tags with route-specific SEO content.
 */
function injectSeoForRoute(html, route, tool) {
  const canonicalUrl = `${ORIGIN}/${route}`;

  // 1. Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${tool.title}</title>`);

  // 2. Replace <meta name="title">
  html = html.replace(
    /<meta name="title" content="[^"]*" \/>/,
    `<meta name="title" content="${tool.title}" />`
  );

  // 3. Replace <meta name="description">
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${tool.desc}" />`
  );

  // 4. Replace <meta name="keywords">
  if (tool.keywords) {
    html = html.replace(
      /<meta name="keywords" content="[^"]*" \/>/,
      `<meta name="keywords" content="${tool.keywords}, image utils, image utility, free online tools" />`
    );
  }

  // 5. Replace <link rel="canonical">
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // 6. Replace OpenGraph tags
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${tool.title}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${tool.desc}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );

  // 7. Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${tool.title}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${tool.desc}" />`
  );

  // 8. Inject Structured Data before </head>
  const richDataJson = buildStructuredDataJson(tool, canonicalUrl);
  html = html.replace('</head>', `${richDataJson}\n  </head>`);

  // 9. Replace <main ...>...</main> in the base HTML with the route-specific helpful content
  const mainRegex = /<main id="main-content"[\s\S]*?<\/main>/;
  const toolMainHtml = buildToolHtmlBody(tool);
  html = html.replace(mainRegex, toolMainHtml.trim());

  return html;
}

/**
 * Vite plugin: runs after Vite finishes building dist/
 */
export default function seoInjectPlugin() {
  return {
    name: 'vite-plugin-seo-inject',
    enforce: 'post',
    apply: 'build',

    closeBundle() {
      const distDir = resolve(process.cwd(), 'dist');
      const baseHtmlPath = resolve(distDir, 'index.html');

      if (!existsSync(baseHtmlPath)) {
        console.warn('⚠️ [vite-plugin-seo-inject] dist/index.html not found, skipping SEO injection.');
        return;
      }

      const baseHtml = readFileSync(baseHtmlPath, 'utf-8');
      let count = 0;

      for (const [route, tool] of Object.entries(TOOLS_SEO_DATA)) {
        const routeHtml = injectSeoForRoute(baseHtml, route, tool);

        // 1. Output as /dist/<route>.html (for servers configured with cleanUrls)
        const flatHtmlPath = resolve(distDir, `${route}.html`);
        writeFileSync(flatHtmlPath, routeHtml, 'utf-8');

        // 2. Output as /dist/<route>/index.html (for directory-based routing)
        const routeDir = resolve(distDir, route);
        if (!existsSync(routeDir)) {
          mkdirSync(routeDir, { recursive: true });
        }
        writeFileSync(resolve(routeDir, 'index.html'), routeHtml, 'utf-8');

        count++;
      }

      // Auto-sync sitemap.xml lastmod date to current build date
      const publicSitemapPath = resolve(process.cwd(), 'public', 'sitemap.xml');
      const distSitemapPath = resolve(distDir, 'sitemap.xml');
      if (existsSync(publicSitemapPath)) {
        const todayStr = new Date().toISOString().split('T')[0];
        let sitemapContent = readFileSync(publicSitemapPath, 'utf-8');
        sitemapContent = sitemapContent.replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${todayStr}</lastmod>`);
        writeFileSync(publicSitemapPath, sitemapContent, 'utf-8');
        writeFileSync(distSitemapPath, sitemapContent, 'utf-8');
        console.log(`🗺️ [vite-plugin-seo-inject] Synced sitemap.xml <lastmod> to ${todayStr}`);
      }

      console.log(
        `\n🚀 [vite-plugin-seo-inject] Generated ${count} comprehensive, rich HTML pages with HowTo, FAQPage, Breadcrumb schemas, and unique content!\n`
      );
    },
  };
}
