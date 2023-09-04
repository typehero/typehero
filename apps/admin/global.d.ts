declare module '*.md' {
  const text: string;
  export default text;
}
declare module '*.png';

declare namespace NodeJS {
  interface ProcessEnv {
    // @ts-ignore
    NODE_ENV: 'development' | 'production' | 'test';
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    PORT: string;
    RESEND_API_KEY: string;
  }
}
