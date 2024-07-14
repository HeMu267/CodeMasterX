const fs = require("fs");
const path = require("path");
const { ProblemDefinitionParser } = require("./problemDefinitionGenerator");
const { FullProblemDefinitionParser } = require("./fullProblemDefinitionGenerator");
const dotenv = require('dotenv');
dotenv.config();

const PROBLEMS_DIR_PATH = process.env.PROBLEMS_DIR_PATH || "";

if (!PROBLEMS_DIR_PATH) {
  console.log("Please set a valid problems directory path in .env file.");
  process.exit(1);
}

// Get the problem folder from command-line arguments
const problemFolder = process.argv[2];

if (!problemFolder) {
  console.log("Please specify a problem folder.");
  process.exit(1);
}

const problemFolderPath = path.join(PROBLEMS_DIR_PATH, problemFolder);

if (!fs.existsSync(problemFolderPath)) {
  console.log(`Problem folder '${problemFolder}' does not exist.`);
  process.exit(1);
}

function generatePartialBoilerplate(generatorFilePath) {
  const inputFilePath = path.join(generatorFilePath, "Structure.md");
  const boilerplatePath = path.join(generatorFilePath, "boilerplate");

  // Read the input file
  const input = fs.readFileSync(inputFilePath, "utf-8");

  // Parse the input
  const parser = new ProblemDefinitionParser();
  parser.parse(input);

  // Generate the boilerplate code
  const cppCode = parser.generateCpp();
  const jsCode = parser.generateJs();
  const rustCode = parser.generateRust();

  // Ensure the boilerplate directory exists
  if (!fs.existsSync(boilerplatePath)) {
    fs.mkdirSync(boilerplatePath, { recursive: true });
  }

  // Write the boilerplate code to respective files
  fs.writeFileSync(path.join(boilerplatePath, "function.cpp"), cppCode);
  fs.writeFileSync(path.join(boilerplatePath, "function.js"), jsCode);
  fs.writeFileSync(path.join(boilerplatePath, "function.rs"), rustCode);

  console.log("Boilerplate code generated successfully!");
}

function generateFullBoilerPLate(generatorFilePath) {
  const inputFilePath = path.join(generatorFilePath, "Structure.md");
  const boilerplatePath = path.join(generatorFilePath, "boilerplate-full");

  // Read the input file
  const input = fs.readFileSync(inputFilePath, "utf-8");

  // Parse the input
  const parser = new FullProblemDefinitionParser();
  parser.parse(input);

  // Generate the boilerplate code
  const cppCode = parser.generateCpp();
  const jsCode = parser.generateJs();
  const rustCode = parser.generateRust();

  // Ensure the boilerplate directory exists
  if (!fs.existsSync(boilerplatePath)) {
    fs.mkdirSync(boilerplatePath, { recursive: true });
  }

  // Write the boilerplate code to respective files
  fs.writeFileSync(path.join(boilerplatePath, "function.cpp"), cppCode);
  fs.writeFileSync(path.join(boilerplatePath, "function.js"), jsCode);
  fs.writeFileSync(path.join(boilerplatePath, "function.rs"), rustCode);

  console.log("Full Boilerplate code generated successfully!");
}

async function getFolders(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        return reject(err);
      }

      const folders = [];
      let pending = files.length;

      if (!pending) return resolve(folders);

      files.forEach(file => {
        const filePath = path.join(dir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            return reject(err);
          }

          if (stats.isDirectory()) {
            folders.push(file);
          }

          if (!--pending) {
            resolve(folders);
          }
        });
      });
    });
  });
}

async function main() {
  try {
    const folders = await getFolders(PROBLEMS_DIR_PATH);
    await Promise.all(
      folders.map(async (folder) => {
        const folderPath = path.join(PROBLEMS_DIR_PATH, folder);
        generatePartialBoilerplate(folderPath);
        generateFullBoilerPLate(folderPath);
      })
    );
  } catch (err) {
    console.error("Error processing folders:", err);
  }
}

// If a specific problem folder is provided, generate boilerplate for that folder only
if (process.argv.length > 2) {
  generatePartialBoilerplate(problemFolderPath);
  generateFullBoilerPLate(problemFolderPath);
} else {
  main();
}
