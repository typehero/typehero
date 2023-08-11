/**
 * Replace the protocol and www subdomain with empty string
 * @example
 * https://www.google.com =\> google.com
 */
export const stripProtocolAndWWW = (url: string) => {
  return url.replace(/(?:^\w+:|^)\/\//, '').replace(/^www\./, '');
};
