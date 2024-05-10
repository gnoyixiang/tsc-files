#!/usr/bin/env node

import { readdirSync, readFileSync } from "fs";

function extractCompilerOptions(tsconfig) {
  const json = JSON.parse(removeComments(tsconfig));
  const compilerOptions = Object.entries(json.compilerOptions)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `--${key} ${v}`).join(" ");
      }
      return `--${key} ${value}`;
    })
    .join(" ");
  const excludeFiles = json.exclude
    ? `--excludeFiles ${json.exclude
        .map((file) => file)
        .join(",")} --excludeDirectories ${json.exclude
        .map((file) => file)
        .join(",")}`
    : "";
  return `${compilerOptions} ${excludeFiles}`;
}

function removeComments(str) {
  let isMultiLineComment = false;
  return str
    .split("\n")
    .map((line) => {
      const content = line.trim();
      let result = line;
      // check if start with single line comment
      if (content.startsWith("//")) {
        return "";
      }
      // check if start with multi line comment
      if (content.startsWith("/*")) {
        isMultiLineComment = true;
        result = "";
      }
      if (content.endsWith("/*")) {
        isMultiLineComment = false;
        result = "";
      }
      if (isMultiLineComment) {
        result = "";
      }
      return result;
    })
    .filter(Boolean)
    .join("\n");
}

function getTsConfig(config) {
  if (config) {
    return readFileSync(config, { encoding: "utf-8" });
  }
  const filename = readdirSync(".").find((file) => file === "tsconfig.json");
  if (!filename) {
    throw new Error("tsconfig.json not found");
  }
  return readFileSync(filename, { encoding: "utf-8" });
}

console.log(extractCompilerOptions(getTsConfig()));
