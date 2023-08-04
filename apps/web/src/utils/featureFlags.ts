// For now we use this since it is a simp build time thingy
export function isProd() {
  return process.env.NODE_ENV === 'production';
}
