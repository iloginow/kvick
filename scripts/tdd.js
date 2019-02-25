const path = require('path');
const nodeWatch = require('node-watch');
const Mocha = require('mocha');
const tsNode = require('ts-node');
const chalk = require('chalk');

const tsConfigPath = path.resolve(__dirname, '../tsconfig.json');
const srcPath = path.resolve(__dirname, '../src');
const testPath = path.resolve(__dirname, '../test');

try {
  tsNode.register({
    tsConfigPath,
    transpileOnly: true,
  });
} catch (error) {
  console.log(chalk.red.bold(`[ERROR] ${error.message}`));

  process.exit(1);
}

showMessage('Waiting for changes...');

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

  clear();

  try {
    mocha.addFile(spec);
    mocha.run(() => {
      mocha.unloadFiles();
      showMessage('Waiting for changes...');
    });
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      showMessage('Corresponding spec file not found!');
      showMessage('Waiting for changes...');
    } else {
      showMessage('Error while trying to execute test suite!');
      showMessage('Waiting for changes...');
    }
  }
}

function clear() {
  process.stdout.write('\x1b[2J');
  process.stdout.write('\x1b[0f');
}

function showMessage(msg) {
  console.log(chalk.white.bold(`> ${msg}`));
}
