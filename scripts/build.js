const fs = require('fs');
const path = require('path');
const rollup = require('rollup');

const rollupPluginTypescript2 = require('rollup-plugin-typescript2');

const inputPath = path.resolve(__dirname, '../src/Kvick.ts');
const distPath = path.resolve(__dirname, '../dist');
const bundlePath = path.resolve(__dirname, '../dist/kvick.js');

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

async function build() {
  const bundle = await rollup.rollup(inputOptions);

  await bundle.write(outputOptions);
}

if(fs.existsSync(distPath)) {
  if(fs.existsSync(bundlePath)) {
    fs.unlinkSync(bundlePath);
  }
} else {
  fs.mkdirSync(distPath);
}

build();
