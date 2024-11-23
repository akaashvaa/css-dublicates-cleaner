#!/usr/bin/env node
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { glob } from "glob";
import { Command } from "commander";
import postcss from "postcss";
import postcssScss from "postcss-scss";

// tool for the handling CLI command in node js - https://github.com/tj/commander.js
const program = new Command();

program
  .version("1.0.0")
  .description(
    "CSS Cleaner Tool - Remove duplicate properties from CSS/SCSS files, keeping the last occurrence.",
  )
  .argument("[target]", "File or directory to clean ", "src") // Default to "src"
  .option("-r, --recursive", "Process files recursively in directories", false) // nested search for .css/.scss
  .option("--fix", "Automatically fix duplicates in the files", false) // fixing the dublicates
  .action((target, options) => {
    // console.log(target, options);

    const absoluteTarget = path.resolve(target); // Resolve the path relative to the root
    // console.log(absoluteTarget);

    // Check if the target exists
    if (!fs.existsSync(absoluteTarget)) {
      console.log(
        chalk.red(
          `Error: Target path '${target}' does not exist on the root directory of your project.`,
        ),
      );
      process.exit(1); // Exit with an error code
    }
    const isDirectory =
      fs.existsSync(absoluteTarget) &&
      fs.statSync(absoluteTarget).isDirectory();

    // find all .css/.scss files
    const files = isDirectory
      ? glob.sync(path.join(absoluteTarget, "**/*.{css,scss}"), {
          absolute: true,
        })
      : [absoluteTarget];
    // If not a directory, assume it's a single file

    if (files.length === 0) {
      console.log(chalk.yellow("No CSS or SCSS files found."));
      return;
    }

    files.forEach((file) => {
      // Pass fix flag to the function
      cleanFile(file, options.fix);
    });
  });

program.parse(process.argv);

function cleanFile(file, shouldFix) {
  const content = fs.readFileSync(file, "utf-8");
  const root = postcss.parse(content, { syntax: postcssScss });

  const relativePath = path.relative(process.cwd(), file);

  // Universal clickable link
  const clickableLink = `\u001b]8;;file://${file}\u001b\\${relativePath}\u001b]8;;\u001b\\`;

  // Flag to track if duplicates are found
  let hasDuplicates = false;

  root.walkRules((rule) => {
    const seenProperties = new Map();

    rule.nodes
      .slice()
      .reverse()
      .forEach((decl) => {
        if (decl.type === "decl") {
          const name = decl.prop;
          if (seenProperties.has(name)) {
            hasDuplicates = true;
            if (shouldFix) {
              decl.remove();
            }
          } else {
            seenProperties.set(name, decl);
          }
        }
      });
  });

  if (hasDuplicates) {
    if (shouldFix) {
      const result = root.toString();

      // Overwrite the file only if --fix is true
      fs.writeFileSync(file, result, "utf-8");

      console.log(chalk.green(`Removed Dublicates from : ${clickableLink}`));
    } else {
      console.log(chalk.yellow(`Duplicates found in : ${clickableLink}`));
    }
  }
  //  else {
  //   console.log(chalk.blue(`No duplicates found in : ${relativePath}`));
  // }
}
