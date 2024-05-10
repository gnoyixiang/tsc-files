#!/bin/bash

pnpm dlx terser src/extract-tsc-options.js --compress --mangle > bin/extract-tsc-options.js
pnpm dlx terser src/extract-files.js  --compress --mangle > bin/extract-files.js
cp src/main.sh bin/main.sh
