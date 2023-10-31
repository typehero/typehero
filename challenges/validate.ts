import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import Ajv from 'ajv';
import {
  CompilerHost,
  createProgram,
  createSourceFile,
  flattenDiagnosticMessageText,
  getPreEmitDiagnostics,
  readConfigFile,
  ScriptKind,
  ScriptTarget,
  sys,
} from 'typescript';

import picocolors from 'picocolors';

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
*/

const dir = __dirname;

export const getChallengeIds = () => {
  return readdirSync(dir)
    .filter((id) => id !== 'blank')
    .filter((id) => statSync(join(dir, id)).isDirectory())
    .filter((id) => statSync(join(dir, id, 'metadata.json')).isFile())
    .filter((id) => statSync(join(dir, id, 'tsconfig.json')).isFile());
};

// node_modules/typescript/lib/
function loadLib(libPath: string) {
  const standardTypeDefs = readFileSync(libPath, 'utf8');
  return createSourceFile(libPath, standardTypeDefs, ScriptTarget.ESNext, true, ScriptKind.TS);
}

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

const standardLibs = [
  'node_modules/typescript/lib/lib.decorators.d.ts',
  'node_modules/typescript/lib/lib.decorators.legacy.d.ts',
  'node_modules/typescript/lib/lib.d.ts',
  'node_modules/typescript/lib/lib.es5.d.ts',
  'node_modules/typescript/lib/lib.webworker.importscripts.d.ts',
  'node_modules/typescript/lib/lib.scripthost.d.ts',
  'node_modules/typescript/lib/lib.dom.d.ts',
  'node_modules/typescript/lib/lib.esnext.d.ts',
];

// TODO: make these work
const thirdPartyLibs = [
  // 'node_modules/type-testing/dist/Equal.d.ts',
  // 'node_modules/type-testing/dist/Expect.d.ts',
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
      const tsconfig = readConfigFile(join(dir, id, 'tsconfig.json'), sys.readFile).config
        .compilerOptions;
      const testsSource = readFileSync(join(dir, id, 'tests.ts'), 'utf8');

      readdirSync(join(dir, id, 'solutions')).forEach((file) => {
        const solutionPath = join(dir, id, 'solutions', file);
        const solutionSource = readFileSync(solutionPath, 'utf8');

        // our challenge test file
        const sourceFile = createSourceFile(
          `in-memory/${id}/${file}`,
          `${testsSource}\n${solutionSource}`,
          ScriptTarget.Latest,
        );

        // This is needed
        const compilerHost: CompilerHost = {
          fileExists: (fileName) => fileName === sourceFile.fileName,
          getSourceFile: (fileName) => {
            for (const libPath of standardLibs) {
              if (libPath.endsWith(fileName)) return loadLib(libPath);
            }

            // read the dts file from node modules
            if (fileName === sourceFile.fileName) return sourceFile;
          },
          getDefaultLibFileName: () => 'lib.d.ts',
          writeFile: () => {},
          getCurrentDirectory: () => '/',
          getCanonicalFileName: (f) => f.toLowerCase(),
          getNewLine: () => '\n',
          useCaseSensitiveFileNames: () => false,
          readFile: (fileName) => (fileName === sourceFile.fileName ? sourceFile.text : undefined),
        };

        const program = createProgram([sourceFile.fileName], tsconfig, compilerHost);

        const errors: string[] = [];
        getPreEmitDiagnostics(program, sourceFile).forEach((diagnostic) => {
          const message = flattenDiagnosticMessageText(diagnostic.messageText, '\n');

          errors.push(message);
        });

        const errorOrSuccessColor = errors.length === 0 ? picocolors.green : picocolors.red;
        const statusSymbol = errors.length === 0 ? '✓' : '✗';
        console.log(errorOrSuccessColor(`${statusSymbol} ${id}/solutions/${file}`));
        console.log(errors.join('\n'));

        console.log('');
      });
    });
};

const validate = () => {
  validateMetadataFiles();
  validateTests();
};

validate();
