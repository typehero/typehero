import { NextResponse } from 'next/server';
import * as ts from 'typescript';
import * as fs from 'node:fs';
import * as path from 'node:path';

// get root path of monorepo
const [rootPath] = process.cwd().split('apps');

function loadStandardLib(libName: string) {
  const pathToLib = path.resolve(`${rootPath}node_modules/typescript/lib/${libName}`);
  const standardLib = fs.readFileSync(pathToLib, 'utf8');

  return ts.createSourceFile(
    libName,
    standardLib.toString(),
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TS,
  );
}

const standardLibs = [
  'lib.decorators.d.ts',
  'lib.decorators.legacy.d.ts',
  'lib.d.ts',
  'lib.es5.d.ts',
  'lib.webworker.importscripts.d.ts',
  'lib.scripthost.d.ts',
  'lib.dom.d.ts',
  'lib.esnext.d.ts',
];

function typecheck({ code, testCase }: { code: string; testCase: string }) {
  console.log(`Type checking the following code:\n${code}\n`);

  // all we haev to do is just concat the files?
  const file = ts.createSourceFile(
    'index.ts',
    `${code}\n${testCase}`,
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TS,
  );

  // This is needed
  const compilerHost: ts.CompilerHost = {
    fileExists: (fileName) => fileName === file.fileName,
    getSourceFile: (fileName) => {
      for (const lib of standardLibs) {
        if (fileName === lib) return loadStandardLib(lib);
      }
      // read the dts file from node modules
      if (fileName === file.fileName) return file;
    },
    getDefaultLibFileName: () => 'lib.d.ts',
    writeFile: () => { },
    getCurrentDirectory: () => '/',
    getCanonicalFileName: (f) => f.toLowerCase(),
    getNewLine: () => '\n',
    useCaseSensitiveFileNames: () => false,
    readFile: (fileName) => (fileName === file.fileName ? file.text : undefined),
  };

  const program = ts.createProgram(
    [file.fileName],
    {
      allowJs: true,
      noEmit: true,
      noEmitOnError: true,
      noImplicitAny: true,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
    },
    compilerHost,
  );

  const emitResult = program.emit();
  const allDiagnostics = ts.getPreEmitDiagnostics(program);

  const errors: string[] = [];

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start!,
      );
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
      errors.push(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
      console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
      errors.push(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    }
  });

  const exitCode = emitResult.emitSkipped ? 1 : 0;
  console.log(`Process exiting with code '${exitCode}'.`);

  return {
    status: exitCode,
    errors,
  };
}

export async function POST(req: Request) {
  const { code, testCase } = await req.json();

  const result = typecheck({ code, testCase });
  return NextResponse.json({ result });
}
