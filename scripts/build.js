const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const terser = require('terser');
const zlib = require('zlib');
const chalk = require('chalk');
const ora = require('ora');
const rollupPluginTypescript2 = require('rollup-plugin-typescript2');

const inputPath = path.resolve(__dirname, '../src/Kvick.ts');
const distPath = path.resolve(__dirname, '../dist');
const bundlePath = path.resolve(__dirname, '../dist/kvick.js');
const minifiedBundlePath = path.resolve(__dirname, '../dist/kvick.min.js');

const inputOptions = {
  input: inputPath,
  plugins: [
    rollupPluginTypescript2({
      clean: true,
      include: ['src/**/*'],
      exclude: [ "*.d.ts", "**/*.d.ts" ],
    }),
  ],
};

const outputOptions = {
  file: bundlePath,
  format: 'cjs',
};

const spinner = ora('Building...');

async function build() {
  spinner.start();

  const bundle = await rollup.rollup(inputOptions);

  // generate code
  const { output } = await bundle.generate(outputOptions);
  // extract the only chunk as we're building into a single file
  const [chunk] = output;
  // remove carriage returns
  const code = chunk.code.replace(/\r\m/g, "\m");
  // generate minified version
  const minified = terser.minify(code);

  // write main bundle
  write(bundlePath, code);

  // write minified version
  if (minified.error) {
    logError(minified.error);
  } else {
    write(minifiedBundlePath, minified.code, true);
  }
}

function write (dest, code, zip) {
  fs.writeFile(dest, code, (err) => {
    if (err) return logError(err);

    if (zip) {
      zlib.gzip(code, (err, zipped) => {
        if (err) return logError(err);

        return report(dest, code, `(gzipped: ${getSize(zipped)})`);
      })
    } else {
      return report(dest, code);
    }
  });
}

function report (dest, code, extra) {
  const size = chalk.white.bold(getSize(code));
  const pathInfo = chalk.green.bold(path.relative(process.cwd(), dest));
  const extraInfo = chalk.cyan.bold(extra || '');

  spinner.succeed(`${pathInfo} ${size} ${extraInfo}`);
}

function logError (error) {
  spinner.fail(chalk.red(error));
}

function getSize (code) {
  return `${(code.length / 1024).toFixed(2)}kb`;
}

if(fs.existsSync(distPath)) {
  if(fs.existsSync(bundlePath)) {
    fs.unlinkSync(bundlePath);
  }

  if(fs.existsSync(minifiedBundlePath)) {
    fs.unlinkSync(minifiedBundlePath);
  }
} else {
  fs.mkdirSync(distPath);
}

build();
