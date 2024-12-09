// based on https://github.com/orta/vscode-twoslash-queries
import type * as monaco from 'monaco-editor';
import { createInlayHint, getLeftMostHintOfLine, quickInfoRequest } from './helpers';

/** Strongly-typed RegExp groups (https://github.com/microsoft/TypeScript/issues/32098#issuecomment-1279645368) */
type RegExpGroups<T extends string> = {
  groups: Record<string, string> | { [name in T]: string };
}[] &
  IterableIterator<RegExpMatchArray>;
const twoslashQueryRegex = /^\s*\/\/\s*\^\?$/gm;
// https://regex101.com/r/6Jb8h2/1
const inlineQueryRegex = new RegExp(
  `${/^[^\S\r\n]*(?<start>\S).*\/\/\s*(?<end>=>)/.source}$`,
  'gm',
); // symbol: =>
type InlineQueryMatches = RegExpGroups<'end' | 'start'>;

type InlayHintsPromise = Promise<monaco.languages.InlayHint[]>;
interface Query {
  cancel: monaco.CancellationToken;
  model: monaco.editor.ITextModel;
  monaco: typeof monaco;
  range: monaco.Range;
  worker: monaco.languages.typescript.TypeScriptWorker;
}

export async function checkTwoslashQuery({
  model,
  cancel,
  monaco,
  worker,
}: Query): InlayHintsPromise {
  const results: monaco.languages.InlayHint[] = [];
  const text = model.getValue();
  const m = text.matchAll(twoslashQueryRegex);

  for (const match of m) {
    if (match.index === undefined) {
      break;
    }

    if (cancel.isCancellationRequested) {
      return [];
    }

    const end = match.index + match[0].length - 1;
    const endPos = model.getPositionAt(end);
    const inspectionPos = new monaco.Position(endPos.lineNumber - 1, endPos.column);
    const inspectionOff = model.getOffsetAt(inspectionPos);

    const hint = await quickInfoRequest({
      fileName: model.uri.toString(),
      offset: inspectionOff,
      worker,
    });
    const inlayHint = createInlayHint({
      hint,
      monaco,
      position: endPos,
    });

    if (inlayHint) {
      results.push(inlayHint);
    }
  }

  return results;
}

export async function checkInlineTwoslashQuery({
  model,
  cancel,
  monaco,
  worker,
  range,
}: Query): InlayHintsPromise {
  const results: monaco.languages.InlayHint[] = [];
  const text = model.getValue();
  const m = text.matchAll(inlineQueryRegex) as InlineQueryMatches;

  for (const match of m) {
    if (match.index === undefined) {
      break;
    }

    if (cancel.isCancellationRequested) {
      return [];
    }

    const [line] = match;
    const { start, end: querySymbol } = match.groups;
    const startIndex = line.indexOf(start);
    const offset = model.getOffsetAt(range.getStartPosition());

    const endIndex = line.lastIndexOf(querySymbol) + 2;
    const endPos = model.getPositionAt(endIndex + offset + match.index);

    const inspectionPos = new monaco.Position(endPos.lineNumber - 1, endPos.column);

    const hint = await getLeftMostHintOfLine({
      model,
      position: inspectionPos,
      lineLength: endIndex - startIndex - 2,
      worker,
      monaco,
    });

    const inlayHint = createInlayHint({
      hint,
      monaco,
      position: endPos,
    });

    if (inlayHint) {
      results.push(inlayHint);
    }
  }

  return results;
}
export async function getHintsFromQueries(queryInfo: Query): Promise<{
  hints: monaco.languages.InlayHint[];
  dispose: () => void;
}> {
  const queries = [checkTwoslashQuery, checkInlineTwoslashQuery];
  const results: monaco.languages.InlayHint[] = [];

  for (const query of queries) {
    const queryResults = await query(queryInfo);
    results.push(...queryResults);
  }

  return {
    hints: results,
    // TODO: is InlayHintList's dispose() required? Or is it just an optional Disposable?
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    dispose: () => {},
  };
}
