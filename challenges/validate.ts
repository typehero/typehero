import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import Ajv from 'ajv';
import {
  createCompilerHost,
  createProgram,
  createSourceFile,
  flattenDiagnosticMessageText,
  getPreEmitDiagnostics,
  readConfigFile,
  ScriptTarget,
  sys,
} from 'typescript';

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

const getMetadata = (id: string) => {
  const metadataFilePath = join(dir, id, 'metadata.json');
  const metadataFile = readFileSync(metadataFilePath).toString();
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

  const schema = JSON.parse(readFileSync(join(dir, 'metadata.schema.json')).toString());

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
      const testsSource = readFileSync(join(dir, id, 'tests.ts')).toString();

      readdirSync(join(dir, id, 'solutions')).forEach((file) => {
        const solutionPath = join(dir, id, 'solutions', file);
        const solutionSource = readFileSync(solutionPath).toString();

        const sourceFileName = `in-memory/${id}/${file}`;

        const compilerHost = createCompilerHost(tsconfig, true);
        const program = createProgram([sourceFileName], tsconfig, compilerHost);

        console.log(`checking ${solutionPath}`);
        const sourceFile = createSourceFile(
          sourceFileName,
          `${testsSource}\n${solutionSource}`,
          ScriptTarget.Latest,
        );
        console.log('sourceFile', sourceFile);

        getPreEmitDiagnostics(program, sourceFile).forEach((diagnostic) => {
          const message = flattenDiagnosticMessageText(diagnostic.messageText, '\n');

          console.error(
            `[ERROR] challenge solution \`${id}/solutions/${file}\` contains the following error when run against the tests: ${message}`,
          );
        });
      });
    });
};

const validate = () => {
  validateMetadataFiles();
  validateTests();
};

validate();
