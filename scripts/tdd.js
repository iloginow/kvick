const path = require('path');
const nodeWatch = require('node-watch');
const Mocha = require('mocha');
const tsNode = require('ts-node');

const tsConfigPath = path.resolve(__dirname, '../tsconfig.json');
const srcPath = path.resolve(__dirname, '../src');
const testPath = path.resolve(__dirname, '../test');

try {
  tsNode.register({
    tsConfigPath,
    transpileOnly: true,
  });
} catch (error) {
  console.log('[ERROR] ' + error.message);

  process.exit(1);
}

nodeWatch(srcPath, { recursive: true }, (evt, name) => {
  const affectedFile = name.replace(srcPath, '');
  const pathChunks = name.split('/');
  const strippedFileName = pathChunks[pathChunks.length - 1];

  const testName = `${strippedFileName.split('.')[0].toLowerCase()}.spec.ts`;
  const localPath = `./${affectedFile.replace(strippedFileName, testName)}`;

  const specPath = path.resolve(testPath, localPath);

  runUnitTests(specPath);
});

nodeWatch(testPath, { recursive: true }, (evt, name) => {
  runUnitTests(name);
});

function runUnitTests(spec) {
  const mocha = new Mocha();

  mocha.addFile(spec);
  mocha.run(() => {
    mocha.unloadFiles();
  });
}
