import * as ts from 'typescript';
/**
 * 
 * @param context 
 * @returns the submitted text, but effectively anything that isn't a type Declaration removed.
 */
const transformer: ts.TransformerFactory<ts.SourceFile> = context => {
  return sourceFile => {
    const visitor = (node: ts.Node): ts.Node | undefined => {
      if (
        ts.isExpressionStatement(node)
        || ts.isImportDeclaration(node)
        || ts.isVariableStatement(node)
        || ts.isFunctionDeclaration(node)
      ) {
        return undefined;
      }
      const visited = ts.visitEachChild(node, visitor, context);

      return visited;
    };

    return ts.visitEachChild(sourceFile, visitor, context);
  };
};
