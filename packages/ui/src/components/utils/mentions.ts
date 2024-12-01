import {
  findAndReplace,
  type RegExpMatchObject,
  type ReplaceFunction,
} from 'mdast-util-find-and-replace';
import type { Nodes } from 'mdast-util-find-and-replace/lib';

export interface BuildUrlValueBase {
  user: string;
}

export interface CommitBuildUrlValues extends BuildUrlValueBase {
  type: 'commit';
  project: string;
  hash: string;
}

export interface CompareBuildUrlValues extends BuildUrlValueBase {
  type: 'compare';
  project: string;
  base: string;
  compare: string;
}

export interface IssueBuildUrlValues extends BuildUrlValueBase {
  type: 'issue';
  project: string;
  no: string;
}

export interface MentionBuildUrlValues extends BuildUrlValueBase {
  type: 'mention';
}

export type BuildUrlValues =
  | CommitBuildUrlValues
  | CompareBuildUrlValues
  | IssueBuildUrlValues
  | MentionBuildUrlValues;

/**
 * yoinked from https://github.com/remarkjs/remark-github/blob/main/lib/index.js#L177
 * courtesy of @hacksore
 */
export function buildUrl(values: BuildUrlValues) {
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
  return function (tree: Nodes) {
    const replaceMention = ((value: string, username: string, match: RegExpMatchObject) => {
      if (
        /[\w`]/.test(match.input.charAt(match.index - 1)) ||
        /[/\w`]/.test(match.input.charAt(Number(match.index) + Number(value.length)))
      ) {
        return false;
      }

      const url = buildUrl({ type: 'mention', user: username });

      if (!url) return false;

      /** @type {PhrasingContent} */
      const node = { type: 'text', value };

      return { type: 'link', title: null, url, children: [node] };
    }) as ReplaceFunction;

    findAndReplace(tree, [[mentionRegex, replaceMention]], { ignore: ['link', 'linkReference'] });
  };
}
