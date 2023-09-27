const URL = 'https://typehero.dev';

interface Post {
  url: string;
  lastModified: string;
}

function generateSiteMap(routes: Post[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     ${routes
      .map(({ lastModified, url }) => {
        return `
           <url>
            <loc>${url}</loc>
            <lastmod>${lastModified}</lastmod>
           </url>
         `;
      })
      .join('')}
   </urlset>
 `;
}

export async function GET() {
  const routes = ['', '/tracks', '/challenege'].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return new Response(generateSiteMap(routes), {
    status: 200,
    headers: {
      'Cache-control': 'public, s-maxage=86400, stale-while-revalidate',
      'content-type': 'application/xml',
    },
  });
}
