import { findAndReplace } from 'mdast-util-find-and-replace';

/**
 * yoinked from https://github.com/remarkjs/remark-github/blob/main/lib/index.js#L177
 * courtesy of @hacksore
 */
export function buildUrl(values) {
  const base = '';

  if (values.type === 'mention') {
    return [base, values.user].join('/');
  }

  const { project, user } = values;

  if (values.type === 'commit') {
    return [base, user, project, 'commit', values.hash].join('/');
  }

  if (values.type === 'issue') {
    return [base, user, project, 'issues', values.no].join('/');
  }

  // `values.type` is `'compare'`
  return [base, user, project, 'compare', `${values.base}...${values.compare}`].join('/');
}

const userGroup = '[\\da-z][-\\da-z]{0,38}';
const mentionRegex = new RegExp(`(@${userGroup}(?:\\/${userGroup})?)`, 'gi');

export function userMentions() {
  return function (tree) {
    findAndReplace(tree, [[mentionRegex, replaceMention]], { ignore: ['link', 'linkReference'] });

    /**
     * @type {ReplaceFunction}
     * @param {string} value
     * @param {string} username
     * @param {RegExpMatchObject} match
     */
    function replaceMention(value, username, match) {
      if (
        /[\w`]/.test(match.input.charAt(match.index - 1)) ||
        /[/\w`]/.test(match.input.charAt(match.index + value.length))
      ) {
        return false;
      }

      const url = buildUrl({ type: 'mention', user: username });

      if (!url) return false;

      /** @type {PhrasingContent} */
      const node = { type: 'text', value };

      return { type: 'link', title: null, url, children: [node] };
    }
  };
}
