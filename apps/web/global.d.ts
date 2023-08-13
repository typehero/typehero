declare module '*.md' {
  const text: string;
  export default text;
}
declare module '*.png';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    PORT: number;
  }
}
