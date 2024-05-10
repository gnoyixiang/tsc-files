#!/bin/bash

show_help() {
  echo "Usage: $(basename $0) [OPTIONS]"
  echo "Options:"
  echo "  -f, --files         comma separated file paths"
  echo "  -i, --input_file    path to input file containing file paths"
  echo "  -s, --staged_only   only check staged files"
  # Add more options and descriptions as needed
  exit 0
}

if [[ "$1" == "-h" || "$1" == "--help" ]]; then
  show_help
  exit 0
fi

while [ $# -gt 0 ]; do
  if [[ $1 == "--"* ]]; then
    v="${1/--/}"
    declare "$v"="$2"
    shift
  fi
  shift
done

if [[ -z $files ]]; then
  files=$f
fi
if [[ -z $input_file ]]; then
  input_file=$i
fi

echo "files = $files"
echo "input_file = $input_file"
echo "staged_only = $staged_only"

if [[ $staged_only == "true" ]]; then
  filepaths=$(git diff --staged --name-only --diff-filter=AM | grep -E '.+\.(ts|tsx)$')
else
  filepaths=$(node $(dirname $0)/extract-files.js)
fi
echo "filepaths $filepaths"

tsc_options=$(node $(dirname $0)/extract-tsc-options.js --files $files --input_file $input_file)
echo "tsc_options $tsc_options"

npx tsc $staged_files $tsc_options
if(( $? == 0 )); then
  echo "✅ typecheck passed"
else
  echo "❌ typecheck failed"
fi
