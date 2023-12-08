declare module '*.md' {
  const text: string;
  export default text;
}
declare module '*.png';
declare module '*.webp';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    PORT: number;
    RESEND_API_KEY: string;
    EDGE_CONFIG: string;
    STAGING?: string;
    NEXT_PUBLIC_ALGOLIA_APP_ID: string;
    NEXT_PUBLIC_ALGOLIA_API_KEY: string;
  }
}
