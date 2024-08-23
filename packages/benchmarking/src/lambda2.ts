import { Project, ts } from 'ts-morph';

const project = new Project();

const baseSource = 'console.info(\'hello world\');type Bob = string;'

const source = project.createSourceFile('tt/test.ts', writer => {
  writer.writeLine(baseSource);
});

source.transform(traversal => {
  const node = traversal.visitChildren();

  if(ts.isTypeAliasDeclaration(node)) {
    return node;
  } else if (ts.isSourceFile(node)) {
    return node;
  }

  return undefined; 
});

project.saveSync();

console.info(source.getFullText())
