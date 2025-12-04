/**
 * Extracts WikiLinks from a string.
 * Matches [[Link Title]] and returns an array of titles.
 * @param {string} text
 * @returns {string[]} Array of extracted link titles
 */
export const extractWikiLinks = (text) => {
  if (!text) return [];
  const regex = /\[\[(.*?)\]\]/g;
  const links = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    // We trim the content to handle spaces like [[ Link ]]
    links.push(match[1].trim());
  }
  return links;
};
