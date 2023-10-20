import { Hono } from 'hono/quick';
import ts from 'typescript';
// import fs from 'node:fs';

const app = new Hono();

async function loadStandardLib(libName: string) {
	// const standardTypeDefs = // fs.readFileSync(`node_modules/typescript/lib/${libName}`, 'utf8');
	const standardLib = await import(`typescript/lib/${libName}`);
	console.log('standardLib', standardLib);
	return ts.createSourceFile(libName, standardLib.toString(), ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
}

const standardLibs = [
	'lib.decorators.d.ts',
	// 'lib.decorators.legacy.d.ts',
	// 'lib.d.ts',
	// 'lib.es5.d.ts',
	// 'lib.webworker.importscripts.d.ts',
	// 'lib.scripthost.d.ts',
	// 'lib.dom.d.ts',
	// 'lib.esnext.d.ts',
];

async function typecheck(code: string) {
	console.log(`Type checking the following code:\n${code}\n`);

	for (const libName of standardLibs) {
		console.log('libName', libName);
		try {
			const standardLib = await import(`typescript/lib/${libName}`);
			console.log('code', standardLib);
		} catch (e) {
			console.log(e);
		}
	}

	const file = ts.createSourceFile('index.ts', code, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);

	// This is needed
	const compilerHost: ts.CompilerHost = {
		fileExists: (fileName) => fileName === file.fileName,
		getSourceFile: (fileName) => {
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

	allDiagnostics.forEach((diagnostic) => {
		if (diagnostic.file) {
			const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
			const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
			console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
		} else {
			console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
		}
	});

	const exitCode = emitResult.emitSkipped ? 1 : 0;
	console.log(`Process exiting with code '${exitCode}'.`);

	return {
		status: exitCode,
	};
}

app.post('/api/test', async (c) => {
	const body = await c.req.parseBody();

	const result = typecheck(body.toString());
	try {
		return c.json({
			result,
		});
	} catch (e) {
		console.log(e);
	}
});

export default app;
