import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import Ajv from 'ajv';
import {
  CompilerHost,
  CompilerOptions,
  createProgram,
  createSourceFile,
  flattenDiagnosticMessageText,
  formatDiagnosticsWithColorAndContext,
  getPreEmitDiagnostics,
  readConfigFile,
  ResolvedModuleWithFailedLookupLocations,
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

/** you can add challenge ids here to focus them in the test output */
const focusTests: string[] = [
  // "default-generic-arguments",
  // "typeof",
];

const isFocused = (id: string) => {
  if (focusTests.length === 0) {
    // no tests are included in the `focusTests`, so return true because then, in a sense, all tests are focused
    return true;
  }
  return focusTests.includes(id);
};

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

const repoRoot = join(__dirname, '..');
const challengesDir = `${repoRoot}/challenges/`;

export const getChallengeIds = () => {
  return readdirSync(challengesDir)
    .filter((id) => id !== 'blank')
    .filter((id) => statSync(join(challengesDir, id)).isDirectory())
    .filter((id) => statSync(join(challengesDir, id, 'metadata.json')).isFile())
    .filter((id) => statSync(join(challengesDir, id, 'tsconfig.json')).isFile());
};

const getMetadata = (id: string) => {
  const metadataFilePath = join(challengesDir, id, 'metadata.json');
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

  const schema = JSON.parse(readFileSync(join(challengesDir, 'metadata.schema.json'), 'utf8'));

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

const validateTests = () => {
  getChallengeIds()
    .filter((id) => {
      const path = join(challengesDir, id, 'solutions');
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
      if (!isFocused(id)) {
        return;
      }

      const compilerOptions = readConfigFile(join(challengesDir, id, 'tsconfig.json'), sys.readFile)
        .config.compilerOptions as CompilerOptions;

      const testsSource = readFileSync(join(challengesDir, id, 'tests.ts'), 'utf8');

      readdirSync(join(challengesDir, id, 'solutions')).forEach((file) => {
        const solutionPath = join(challengesDir, id, 'solutions', file);
        const solutionSource = readFileSync(solutionPath, 'utf8');

        // our challenge test file
        const sourceFile = createSourceFile(
          `${repoRoot}/in-memory/${file}`,
          // note: putting the `solutionSource` first avoids "Block-scoped variable used before its declaration" errors at the expense of the imports (which are in `testsSource`) not being at the top of the file. There's no technical reason this is a problem at this moment, but just something to be aware of because it's a little weird.
          `${solutionSource}\n${testsSource}\n`,
          ScriptTarget.Latest,
        );

        const fileExists = (fileName: string) => {
          const answer = sys.fileExists(fileName);
          debug(`fileExists: ${answer}`, fileName);
          return answer;
        };

        const readFile = (fileName: string) => {
          const answer = sys.readFile(fileName);
          debug(`readFile`, fileName, answer);
          return answer;
        };

        const getNewLine = () => '\n';
        const getCurrentDirectory = () => '/';

        const compilerHost = {
          fileExists,
          readFile,
          resolveModuleNameLiterals: (
            moduleNames,
            containingFile,
            redirectedReference,
            options,
            containingSourceFile,
            reusedNames,
          ) => {
            trace(
              'rMNL',
              moduleNames.map((moduleName) => moduleName.text),
              containingFile,
            );

            return moduleNames.map((moduleName): ResolvedModuleWithFailedLookupLocations => {
              // try to use standard resolution
              const result = resolveModuleName(moduleName.text, containingFile, compilerOptions, {
                fileExists,
                readFile,
              });
              if (result.resolvedModule) {
                trace('rMNL resolving normally', result.resolvedModule);
                return result;
              } else {
                trace('rMNL failed to resolve normally', result);
              }

              trace('rMNL failed to resolve', { moduleName });
              throw new Error('failed');
            });
          },
          getSourceFile: (fileName) => {
            debug('getSourceFile', fileName);

            if (fileName.endsWith(sourceFile.fileName)) {
              // we are reading from our in-memory file that doesn't actually exist so in this case we need to fake it
              return sourceFile;
            }

            const standardTypeDefs = readFileSync(`${fileName}`, 'utf8');
            return createSourceFile(
              fileName,
              standardTypeDefs,
              ScriptTarget.ESNext,
              true,
              ScriptKind.TS,
            );
          },

          getDefaultLibFileName: () => `${repoRoot}/node_modules/typescript/lib/lib.d.ts`,
          writeFile: () => {
            throw new Error('Not implemented');
          },
          getCurrentDirectory,
          getCanonicalFileName: (fileName) => fileName.toLowerCase(),
          getNewLine,
          useCaseSensitiveFileNames: () => false,
        } satisfies CompilerHost;

        const program = createProgram([sourceFile.fileName], compilerOptions, compilerHost);

        const errors = getPreEmitDiagnostics(program, sourceFile);
        const formattedErrors = formatDiagnosticsWithColorAndContext(errors, {
          getCanonicalFileName: () => sourceFile.fileName,
          getNewLine,
          getCurrentDirectory,
        });

        const logLine = `challenges/${id}/solutions/${file}`;
        if (errors.length > 0) {
          info(picocolors.red(`✗ ${logLine}`));
          info(formattedErrors);
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
