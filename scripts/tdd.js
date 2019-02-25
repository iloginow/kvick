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

waitingMessage();

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

  mocha.addFile(spec);
  mocha.run(() => {
    mocha.unloadFiles();
    waitingMessage();
  });
}

function clear() {
  process.stdout.write('\x1b[2J');
  process.stdout.write('\x1b[0f');
}

function waitingMessage() {
  console.log(chalk.white.bold('> Waiting for changes...'));
}
