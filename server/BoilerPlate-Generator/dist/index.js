var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/problemDefinitionGenerator.js
var require_problemDefinitionGenerator = __commonJS({
  "src/problemDefinitionGenerator.js"(exports2, module2) {
    var ProblemDefinitionParser2 = class {
      constructor() {
        this.problemName = "";
        this.functionName = "";
        this.inputFields = [];
        this.outputFields = [];
      }
      parse(input) {
        const lines = input.split("\n").map((line) => line.trim());
        let currentSection = null;
        lines.forEach((line) => {
          if (line.startsWith("Problem Name:")) {
            this.problemName = this.extractQuotedValue(line);
          } else if (line.startsWith("Function Name:")) {
            this.functionName = this.extractValue(line);
          } else if (line.startsWith("Input Structure:")) {
            currentSection = "input";
          } else if (line.startsWith("Output Structure:")) {
            currentSection = "output";
          } else if (line.startsWith("Input Field:")) {
            if (currentSection === "input") {
              const field = this.extractField(line);
              if (field) this.inputFields.push(field);
            }
          } else if (line.startsWith("Output Field:")) {
            if (currentSection === "output") {
              const field = this.extractField(line);
              if (field) this.outputFields.push(field);
            }
          }
        });
      }
      extractQuotedValue(line) {
        const match = line.match(/: "(.*)"$/);
        return match ? match[1] : "";
      }
      extractValue(line) {
        const match = line.match(/: (\w+)$/);
        return match ? match[1] : "";
      }
      extractField(line) {
        const match = line.match(/Field: (\w+(?:<\w+>)?) (\w+)$/);
        return match ? { type: match[1], name: match[2] } : null;
      }
      generateCpp() {
        const inputs = this.inputFields.map((field) => `${this.mapTypeToCpp(field.type)} ${field.name}`).join(", ");
        return `${this.mapTypeToCpp(this.outputFields[0].type)} ${this.functionName}(${inputs}) {
    // Implementation goes here
    return result;
}`;
      }
      generateJs() {
        const inputs = this.inputFields.map((field) => field.name).join(", ");
        return `function ${this.functionName}(${inputs}) {
    // Implementation goes here
    return result;
}`;
      }
      generateRust() {
        const inputs = this.inputFields.map((field) => `${field.name}: ${this.mapTypeToRust(field.type)}`).join(", ");
        const outputType = this.mapTypeToRust(this.outputFields[0].type);
        return `fn ${this.functionName}(${inputs}) -> ${outputType} {
    // Implementation goes here
    result
}`;
      }
      mapTypeToRust(type) {
        switch (type) {
          case "int":
            return "i32";
          case "float":
            return "f64";
          case "string":
            return "String";
          case "bool":
            return "bool";
          case "list<int>":
            return "Vec<i32>";
          case "list<float>":
            return "Vec<f64>";
          case "list<string>":
            return "Vec<String>";
          case "list<bool>":
            return "Vec<bool>";
          default:
            return "unknown";
        }
      }
      mapTypeToCpp(type) {
        switch (type) {
          case "int":
            return "int";
          case "float":
            return "float";
          case "string":
            return "std::string";
          case "bool":
            return "bool";
          case "list<int>":
            return "std::vector<int>";
          case "list<float>":
            return "std::vector<float>";
          case "list<string>":
            return "std::vector<std::string>";
          case "list<bool>":
            return "std::vector<bool>";
          default:
            return "unknown";
        }
      }
    };
    module2.exports = { ProblemDefinitionParser: ProblemDefinitionParser2 };
  }
});

// src/fullProblemDefinitionGenerator.js
var require_fullProblemDefinitionGenerator = __commonJS({
  "src/fullProblemDefinitionGenerator.js"(exports2, module2) {
    var FullProblemDefinitionParser2 = class {
      constructor() {
        this.problemName = "";
        this.functionName = "";
        this.inputFields = [];
        this.outputFields = [];
      }
      parse(input) {
        const lines = input.split("\n").map((line) => line.trim());
        let currentSection = null;
        lines.forEach((line) => {
          if (line.startsWith("Problem Name:")) {
            this.problemName = this.extractQuotedValue(line);
          } else if (line.startsWith("Function Name:")) {
            this.functionName = this.extractValue(line);
          } else if (line.startsWith("Input Structure:")) {
            currentSection = "input";
          } else if (line.startsWith("Output Structure:")) {
            currentSection = "output";
          } else if (line.startsWith("Input Field:")) {
            if (currentSection === "input") {
              const field = this.extractField(line);
              if (field) this.inputFields.push(field);
            }
          } else if (line.startsWith("Output Field:")) {
            if (currentSection === "output") {
              const field = this.extractField(line);
              if (field) this.outputFields.push(field);
            }
          }
        });
      }
      extractQuotedValue(line) {
        const match = line.match(/: "(.*)"$/);
        return match ? match[1] : "";
      }
      extractValue(line) {
        const match = line.match(/: (\w+)$/);
        return match ? match[1] : "";
      }
      extractField(line) {
        const match = line.match(/Field: (\w+(?:<\w+>)?) (\w+)$/);
        return match ? { type: match[1], name: match[2] } : null;
      }
      generateCpp() {
        const inputs = this.inputFields.map((field) => `${this.mapTypeToCpp(field.type)} ${field.name}`).join(", ");
        const inputReads = this.inputFields.map((field, index) => {
          if (field.type.startsWith("list<")) {
            return `int size_${field.name};
  std::istringstream(lines[${index}]) >> size_${field.name};
  ${this.mapTypeToCpp(field.type)} ${field.name}(size_${field.name});
  if(!size_${field.name}==0) {
  	std::istringstream iss(lines[${index + 1}]);
  	for (int i=0; i < size_arr; i++) iss >> arr[i];
  }`;
          } else {
            return `${this.mapTypeToCpp(field.type)} ${field.name};
  std::istringstream(lines[${index}]) >> ${field.name};`;
          }
        }).join("\n  ");
        const outputType = this.outputFields[0].type;
        const functionCall = `${outputType} result = ${this.functionName}(${this.inputFields.map((field) => field.name).join(", ")});`;
        const outputWrite = `std::cout << result << std::endl;`;
        return `#include <iostream>
  #include <fstream>
  #include <vector>
  #include <string>
  #include <sstream>
  #include <climits>
  
  ##USER_CODE_HERE##
  
  int main() {
    std::ifstream file("/dev/problems/${this.problemName.toLowerCase().replace(" ", "-")}/tests/inputs/##INPUT_FILE_INDEX##.txt");
    std::vector<std::string> lines;
    std::string line;
    while (std::getline(file, line)) lines.push_back(line);
  
    file.close();
    ${inputReads}
    ${functionCall}
    ${outputWrite}
    return 0;
  }
  `;
      }
      generateJs() {
        const inputs = this.inputFields.map((field) => field.name).join(", ");
        const inputReads = this.inputFields.map((field) => {
          if (field.type.startsWith("list<")) {
            return `const size_${field.name} = parseInt(input.shift());
const ${field.name} = input.splice(0, size_${field.name}).map(Number);`;
          } else {
            return `const ${field.name} = parseInt(input.shift());`;
          }
        }).join("\n  ");
        const outputType = this.outputFields[0].type;
        const functionCall = `const result = ${this.functionName}(${this.inputFields.map((field) => field.name).join(", ")});`;
        const outputWrite = `console.log(result);`;
        return `##USER_CODE_HERE##
  
  const input = require('fs').readFileSync('/dev/problems/${this.problemName.toLowerCase().replace(" ", "-")}/tests/inputs/##INPUT_FILE_INDEX##.txt', 'utf8').trim().split('\\n').join(' ').split(' ');
  ${inputReads}
  ${functionCall}
  ${outputWrite}
      `;
      }
      generateRust() {
        const inputs = this.inputFields.map((field) => `${field.name}: ${this.mapTypeToRust(field.type)}`).join(", ");
        const inputReads = this.inputFields.map((field) => {
          if (field.type.startsWith("list<")) {
            return `let size_${field.name}: usize = lines.next().and_then(|line| line.parse().ok()).unwrap_or(0);
	let ${field.name}: ${this.mapTypeToRust(field.type)} = parse_input(lines, size_${field.name});`;
          } else {
            return `let ${field.name}: ${this.mapTypeToRust(field.type)} = lines.next().unwrap().parse().unwrap();`;
          }
        }).join("\n  ");
        const containsVector = this.inputFields.find(
          (field) => field.type.startsWith("list<")
        );
        const outputType = this.mapTypeToRust(this.outputFields[0].type);
        const functionCall = `let result = ${this.functionName}(${this.inputFields.map((field) => field.name).join(", ")});`;
        const outputWrite = `println!("{}", result);`;
        return `use std::fs::read_to_string;
  use std::io::{self};
  use std::str::Lines;
  
  ##USER_CODE_HERE##
  
  fn main() -> io::Result<()> {
    let input = read_to_string("/dev/problems/${this.problemName.toLowerCase().replace(" ", "-")}/tests/inputs/##INPUT_FILE_INDEX##.txt")?;
    let mut lines = input.lines();
    ${inputReads}
    ${functionCall}
    ${outputWrite}
    Ok(())
  }${containsVector ? `
fn parse_input(mut input: Lines, size_arr: usize) -> Vec<i32> {
      let arr: Vec<i32> = input
          .next()
          .unwrap_or_default()
          .split_whitespace()
          .filter_map(|x| x.parse().ok())
          .collect();
  
      if size_arr == 0 {
          Vec::new()
      } else {
          arr
      }
  }` : ""}
  `;
      }
      mapTypeToCpp(type) {
        switch (type) {
          case "int":
            return "int";
          case "float":
            return "float";
          case "string":
            return "std::string";
          case "bool":
            return "bool";
          case "list<int>":
            return "std::vector<int>";
          case "list<float>":
            return "std::vector<float>";
          case "list<string>":
            return "std::vector<std::string>";
          case "list<bool>":
            return "std::vector<bool>";
          default:
            return "unknown";
        }
      }
      mapTypeToRust(type) {
        switch (type) {
          case "int":
            return "i32";
          case "float":
            return "f64";
          case "string":
            return "String";
          case "bool":
            return "bool";
          case "list<int>":
            return "Vec<i32>";
          case "list<float>":
            return "Vec<f64>";
          case "list<string>":
            return "Vec<String>";
          case "list<bool>":
            return "Vec<bool>";
          default:
            return "unknown";
        }
      }
    };
    module2.exports = { FullProblemDefinitionParser: FullProblemDefinitionParser2 };
  }
});

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.4.5",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        "lint-readme": "standard-markdown",
        pretest: "npm run lint && npm run dts-check",
        test: "tap tests/*.js --100 -Rspec",
        "test:coverage": "tap --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@definitelytyped/dtslint": "^0.0.133",
        "@types/node": "^18.11.3",
        decache: "^4.6.1",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-markdown": "^7.1.0",
        "standard-version": "^9.5.0",
        tap: "^16.3.0",
        tar: "^6.1.11",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs2 = require("fs");
    var path2 = require("path");
    var os = require("os");
    var crypto = require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _log(message) {
      console.log(`[dotenv@${version}][INFO] ${message}`);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs2.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path2.resolve(process.cwd(), ".env.vault");
      }
      if (fs2.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path2.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      _log("Loading env from encrypted .env.vault");
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path2.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path3 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs2.readFileSync(path3, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path3} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// src/index.js
var fs = require("fs");
var path = require("path");
var { ProblemDefinitionParser } = require_problemDefinitionGenerator();
var { FullProblemDefinitionParser } = require_fullProblemDefinitionGenerator();
var dotenv = require_main();
dotenv.config();
var PROBLEMS_DIR_PATH = process.env.PROBLEMS_DIR_PATH || "";
if (!PROBLEMS_DIR_PATH) {
  console.log("Please set a valid problems directory path in .env file.");
  process.exit(1);
}
var problemFolder = process.argv[2];
if (!problemFolder) {
  console.log("Please specify a problem folder.");
  process.exit(1);
}
var problemFolderPath = path.join(PROBLEMS_DIR_PATH, problemFolder);
if (!fs.existsSync(problemFolderPath)) {
  console.log(`Problem folder '${problemFolder}' does not exist.`);
  process.exit(1);
}
function generatePartialBoilerplate(generatorFilePath) {
  const inputFilePath = path.join(generatorFilePath, "Structure.md");
  const boilerplatePath = path.join(generatorFilePath, "boilerplate");
  const input = fs.readFileSync(inputFilePath, "utf-8");
  const parser = new ProblemDefinitionParser();
  parser.parse(input);
  const cppCode = parser.generateCpp();
  const jsCode = parser.generateJs();
  const rustCode = parser.generateRust();
  if (!fs.existsSync(boilerplatePath)) {
    fs.mkdirSync(boilerplatePath, { recursive: true });
  }
  fs.writeFileSync(path.join(boilerplatePath, "function.cpp"), cppCode);
  fs.writeFileSync(path.join(boilerplatePath, "function.js"), jsCode);
  fs.writeFileSync(path.join(boilerplatePath, "function.rs"), rustCode);
  console.log("Boilerplate code generated successfully!");
}
function generateFullBoilerPLate(generatorFilePath) {
  const inputFilePath = path.join(generatorFilePath, "Structure.md");
  const boilerplatePath = path.join(generatorFilePath, "boilerplate-full");
  const input = fs.readFileSync(inputFilePath, "utf-8");
  const parser = new FullProblemDefinitionParser();
  parser.parse(input);
  const cppCode = parser.generateCpp();
  const jsCode = parser.generateJs();
  const rustCode = parser.generateRust();
  if (!fs.existsSync(boilerplatePath)) {
    fs.mkdirSync(boilerplatePath, { recursive: true });
  }
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
      files.forEach((file) => {
        const filePath = path.join(dir, file);
        fs.stat(filePath, (err2, stats) => {
          if (err2) {
            return reject(err2);
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
if (process.argv.length > 2) {
  generatePartialBoilerplate(problemFolderPath);
  generateFullBoilerPLate(problemFolderPath);
} else {
  main();
}
