import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import Ajv from 'ajv';
import {
  CompilerHost,
  CompilerOptions,
  createCompilerHost,
  createProgram,
  createSourceFile,
  flattenDiagnosticMessageText,
  getPreEmitDiagnostics,
  readConfigFile,
  ResolvedModule,
  resolveModuleName,
  ScriptKind,
  ScriptTarget,
  sys,
} from 'typescript';

import picocolors from 'picocolors';

type LogLevel = 'silent' | 'error' | 'info' | 'trace' | 'debug';
const LOG_LEVEL = 'info';
const shouldLog = (level: LogLevel) => {
  const levels: Record<LogLevel, number> = {
    silent: 0,
    error: 4,
    info: 7,
    trace: 8,
    debug: 9,
  };
  const currentLevel = levels[LOG_LEVEL];
  const requestedLevel = levels[level];
  return currentLevel >= requestedLevel;
};
const log = (level: LogLevel) => (shouldLog(level) ? console.log : () => {});
const error = log('error');
const info = log('info');
const debug = log('debug');
const trace = log('trace');

/*
this script does a few checks:

1. makes sure each directory has a metadata.json file
1. makes sure each directory has a tsconfig.json file
1. makes sure each directory has a solutions directory with at least one solution file
1. runs JSONSchema validation on all metadata.json files
1. make sure the directory name matches the id contained within it's metadata.json file
  - (bonus: this ensures that the id is unique since you can't have two sibling directories with the same name)
1. make sure the prerequisites are valid ids
1. make sure the prerequisites don't contain the current

Finally, as an almost entirely different task: this script runs each solution and tests pair (for each challenge) through an in-memory TypeScript compiler.
*/

const dir = __dirname;

export const getChallengeIds = () => {
  return readdirSync(dir)
    .filter((id) => id !== 'blank')
    .filter((id) => statSync(join(dir, id)).isDirectory())
    .filter((id) => statSync(join(dir, id, 'metadata.json')).isFile())
    .filter((id) => statSync(join(dir, id, 'tsconfig.json')).isFile());
};

/**
 * This helper will look up a file in the local `node_modules`
 */
const loadLib = (libPath: string) => {
  const standardTypeDefs = readFileSync(`node_modules/${libPath}`, 'utf8');
  return createSourceFile(libPath, standardTypeDefs, ScriptTarget.ESNext, true, ScriptKind.TS);
};

const getMetadata = (id: string) => {
  const metadataFilePath = join(dir, id, 'metadata.json');
  const metadataFile = readFileSync(metadataFilePath, 'utf8');
  const metadata = JSON.parse(metadataFile) as {
    id: string;
    prerequisites: string[];
  };
  return {
    metadataFilePath,
    metadata,
  };
};

const validateMetadataSchema = (ids: string[]) => {
  const ajv = new Ajv();

  const schema = JSON.parse(readFileSync(join(dir, 'metadata.schema.json'), 'utf8'));

  const validate = ajv.compile(schema);

  ids.forEach((id) => {
    const { metadata, metadataFilePath } = getMetadata(id);

    if (!validate(metadata)) {
      console.error(
        `[ERROR]: the challenge metadata file ${metadataFilePath} is invalid: ${JSON.stringify(
          validate.errors,
        )}`,
      );
    }
  });
};

const ensureChallengeIdMatchesDirectory = (id: string) => {
  const { metadataFilePath, metadata } = getMetadata(id);

  if (id !== metadata.id) {
    console.error(
      `[ERROR]: the challenge metadata file ${metadataFilePath} contains the id "${metadata.id}", but this does not match the directory ("${id}").`,
    );
  }
};

const validatePrerequisiteIds = (id: string, _: number, ids: string[]) => {
  const { metadataFilePath, metadata } = getMetadata(id);

  metadata.prerequisites.forEach((prerequisite) => {
    if (!ids.includes(prerequisite)) {
      console.error(
        `[ERROR] the challenge metadata file ${metadataFilePath} contains a prerequisite "${prerequisite}" which does not match any known challenge id.`,
      );
    }

    if (prerequisite === id) {
      console.error(
        `[ERROR] the challenge metadata file ${metadataFilePath} contains a prerequisite "${prerequisite}" which matches the challenge id "${id}"`,
      );
    }
  });
};

const validateMetadataFiles = () => {
  const challengeIds = getChallengeIds();

  validateMetadataSchema(challengeIds);
  challengeIds.forEach(ensureChallengeIdMatchesDirectory);
  challengeIds.forEach(validatePrerequisiteIds);
};

const moduleSearchLocations = ['type-testing/dist/index.d.ts'];

const standardLibs = [
  'typescript/lib/lib.decorators.d.ts',
  'typescript/lib/lib.decorators.legacy.d.ts',
  'typescript/lib/lib.d.ts',
  'typescript/lib/lib.es5.d.ts',
  'typescript/lib/lib.webworker.importscripts.d.ts',
  'typescript/lib/lib.scripthost.d.ts',
  'typescript/lib/lib.dom.d.ts',
  'typescript/lib/lib.esnext.d.ts',
];

const validateTests = () => {
  getChallengeIds()
    .filter((id) => {
      const path = join(dir, id, 'solutions');
      statSync(path).isDirectory();
      readdirSync(path).forEach((file) => {
        if (!/^\d+\.ts$/.test(file)) {
          throw new Error(
            `the solution file name: ${join(path, file)} is invalid: it must only be numeric.`,
          );
        }
      });
      return true;
    })
    .forEach((id) => {
      const compilerOptions = {
        ...(readConfigFile(join(dir, id, 'tsconfig.json'), sys.readFile).config
          .compilerOptions as CompilerOptions),
        // NOTE: we need to make sure we match the same tsconfig in the editor so we don't have issues
        strict: true,
      };

      const testsSource = readFileSync(join(dir, id, 'tests.ts'), 'utf8');

      readdirSync(join(dir, id, 'solutions')).forEach((file) => {
        const solutionPath = join(dir, id, 'solutions', file);
        const solutionSource = readFileSync(solutionPath, 'utf8');

        // our challenge test file
        const sourceFile = createSourceFile(
          file,
          // note: putting the `solutionSource` first avoids "Block-scoped variable used before its declaration" errors at the expense of the imports (which are in `testsSource`) not being at the top of the file. There's no technical reason this is a problem at this moment, but just something to be aware of because it's a little weird.
          `${solutionSource}\n${testsSource}\n`,
          ScriptTarget.Latest,
        );

        const fileExists = (fileName: string) => {
          debug('fileExists', fileName, sourceFile.fileName);
          return sys.fileExists(fileName);
        };

        const readFile = (fileName: string) => {
          debug('readFile', fileName);
          return sys.readFile(fileName);
        };

        const compilerHost = {
          fileExists,
          readFile,
          resolveModuleNames: (moduleNames, containingFile) => {
            trace('rMN', moduleNames, containingFile);

            return moduleNames.map((moduleName) => {
              // try to use standard resolution
              const result = resolveModuleName(moduleName, containingFile, compilerOptions, {
                fileExists,
                readFile,
              });
              if (result.resolvedModule) {
                trace('rMN resolving normally', result.resolvedModule);
                return result.resolvedModule;
              } else {
                trace('rMN failed to resolve normally', result);
              }

              // fallback to custom resolution
              for (const location of moduleSearchLocations) {
                trace('rMN exploring location', { location, moduleName });

                if (location.startsWith(moduleName)) {
                  const result = resolveModuleName(location, containingFile, compilerOptions, {
                    fileExists,
                    readFile,
                  });
                  trace('rMN resolving manually', location, result);
                  return {
                    resolvedFileName: location,
                    isExternalLibraryImport: true,
                  };
                }
              }

              trace('rMN failed to resolve', { moduleName });
              return undefined;
            });
          },
          getSourceFile: (fileName) => {
            debug('getSourceFile', fileName);

            for (const libPath of standardLibs) {
              if (libPath.endsWith(fileName)) {
                debug('getSourceFile found in standardLib', libPath);
                return loadLib(libPath);
              }
            }

            for (const modulePath of moduleSearchLocations) {
              if (fileName === modulePath) {
                debug('getSourceFile found in moduleSearchLocations', modulePath);
                return loadLib(modulePath);
              }
            }

            // read the dts file from node modules
            if (fileName === sourceFile.fileName) {
              debug('getSourceFile matched against the source file');
              return sourceFile;
            }
          },

          getDefaultLibFileName: () => 'lib.d.ts',
          writeFile: () => {},
          getCurrentDirectory: () => '/',
          getCanonicalFileName: (fileName) => fileName.toLowerCase(),
          getNewLine: () => '\n',
          useCaseSensitiveFileNames: () => false,
        } satisfies CompilerHost;

        const program = createProgram([sourceFile.fileName], compilerOptions, compilerHost);

        const errors = getPreEmitDiagnostics(program, sourceFile).map((diagnostic) => {
          return flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        });

        /** keeping the full file path means that you can click to go to a buggy file in the IDE's integrated terminal */
        const logLine = `challenges/${id}/solutions/${file}`;
        if (errors.length > 0) {
          info(picocolors.red(`✗ ${logLine}`));
          info(errors.map((line) => `  ${line}`).join('\n'), '\n');
        } else {
          info(picocolors.green(`✓ ${logLine}`));
        }
      });
    });
};

const validate = () => {
  validateMetadataFiles();
  validateTests();
};

validate();
