import * as ts from 'typescript';
import * as fs from 'node:fs';

export function writeSourceFileToDisk(sourceFile: ts.SourceFile) {
  const printer = ts.createPrinter();
  const fileName = 'test.ts';
  const filePath = `./${fileName}`;
  const fileContent = printer.printFile(sourceFile);
  fs.writeFileSync(filePath, fileContent);
}