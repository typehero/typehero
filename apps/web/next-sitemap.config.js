/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://typehero.dev',
  generateRobotsTxt: true,
  exclude: ['/api/*'],
};

export default config;
