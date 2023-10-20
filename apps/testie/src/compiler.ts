import path from 'node:path';
import ts from 'typescript';

export function createCompilerHost(options: ts.CompilerOptions): ts.CompilerHost {
	return {
		getSourceFile: () => undefined,
		getDefaultLibFileName: () => 'lib.d.ts',
		writeFile: (fileName, content) => ts.sys.writeFile(fileName, content),
		getCurrentDirectory: () => "test",
		getDirectories: (path) => ts.sys.getDirectories(path),
		getCanonicalFileName: (fileName) => (ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase()),
		getNewLine: () => ts.sys.newLine,
		useCaseSensitiveFileNames: () => true,
		fileExists: () => true,
		readFile: () => "tst",
		resolveModuleNames: (_moduleNames, _containingFile) => []
	};

}
