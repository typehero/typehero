export function getMentionsFromComment(text: string) {
  // Regex pattern to match mentions in the format @username
  const pattern = /@([a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38})/g;

  const mentions = [];

  let match;
  while ((match = pattern.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  return Array.from(new Set(mentions)).slice(0, 10);
}
