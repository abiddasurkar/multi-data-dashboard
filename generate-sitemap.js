const fs = require('fs');
const path = require('path');

const baseUrl = 'https://abiddasurkar.github.io/multi-data-dashboard';
const buildDir = path.join(__dirname, 'build');

const pages = [
  { url: '', priority: '1.0', changefreq: 'daily' },
  { url: '/crypto', priority: '0.9', changefreq: 'hourly' },
  { url: '/covid', priority: '0.9', changefreq: 'daily' },
  { url: '/weather', priority: '0.8', changefreq: 'hourly' },
  { url: '/countries', priority: '0.7', changefreq: 'weekly' },
];

const currentDate = new Date().toISOString().split('T')[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

// Create sitemap.xml in build directory
if (fs.existsSync(buildDir)) {
  fs.writeFileSync(path.join(buildDir, 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap generated successfully!');
} else {
  console.error('❌ Build directory not found. Run "npm run build" first.');
}