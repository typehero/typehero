/**
 * 1. Accept code passed to it, with some identifiers
 * 2. Verify code contains only types
 * 3. Write code to disk, generate benchmark
 * 4. Run benchmark
 */

import * as ts from 'typescript';
import { writeSourceFileToDisk } from "./util.ts";

const code = `import { type Testing} from 'not-here';
type Waffles<T extends 'fuck'> = T;

console.info('fucking what')
`;

const sourceFile = ts.createSourceFile(
  'test.ts',
  code,
  ts.ScriptTarget.ESNext,
);

const transformer: ts.TransformerFactory<ts.SourceFile> = context => {
  return sourceFile => {
    let depth = 0;
    const visitor = (node: ts.Node): ts.Node | undefined => {
      depth++;
      console.info(' '.repeat(depth), ts.SyntaxKind[node.kind]);
      if (ts.isExpressionStatement(node) || ts.isImportDeclaration(node)) {
        return undefined;
      }
      const visited = ts.visitEachChild(node, visitor, context);
      depth--;

      return visited;
    };

    return ts.visitEachChild(sourceFile, visitor, context);
  };
};

  // @ts-ignore suck it
const res: ts.TransformationResult = ts.transform(sourceFile, [
  transformer 
]);

const tsTransformedFile: ts.SourceFile = res.transformed[0];


writeSourceFileToDisk(tsTransformedFile);


res.dispose();