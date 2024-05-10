#!/usr/bin/env node
import { readFileSync, existsSync } from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
  .command(
    "extract files",
    "extract files by inline files or filepaths defined in a file"
  )
  .option("files", {
    alias: "f",
    type: "string",
    description: "comma separated file paths",
  })
  .option("input_file", {
    alias: "i",
    type: "string",
    description: "path to input file containing file paths",
  })
  .parse();

function extractFilesFromFile(file) {
  return existsSync(file)
    ? readFileSync(file, { encoding: "utf-8" }).split("\n")
    : [];
}

// split comma separated file paths
function listFiles(fileString) {
  return fileString.split(",");
}

// check if files end with .ts or .tsx, and check if file paths are valid
function checkFileValid(file) {
  return /.+\.tsx?/.test(file) && existsSync(file);
}

function main() {
  const filepaths = [];
  if (argv.files) {
    filepaths.push(...listFiles(argv.files));
  }
  if (argv.input_file) {
    filepaths.push(...extractFilesFromFile(argv.input_file));
  }
  console.log(Array.from(new Set(filepaths)).filter(checkFileValid).join(" "));
}

main();
