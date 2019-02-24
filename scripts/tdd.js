const path = require('path');
const nodeWatch = require('node-watch');
const Mocha = require('mocha');
const tsNode = require('ts-node');

const tsNodeConfig = './tsconfig.json';
const srcPath = path.resolve(__dirname, '../src');
const testPath = path.resolve(__dirname, '../test');

try {
  tsNode.register({
    tsNodeConfig,
    transpileOnly: true,
  });
} catch (error) {
  console.log('[ERROR] ' + error.message);

  process.exit(1);
}

const mocha = new Mocha();

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
  mocha.addFile(spec);
  mocha.run(() => {
    mocha.unloadFiles();
  });
}
