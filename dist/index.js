"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const add_1 = require("./commands/add");
const install_1 = require("./commands/install");
/**
 * Adds the dependency to the “dependencies” object in package.json
 *
 * Argument <package>: A "name@version" string as defined [here](https://github.com/npm/node-semver#versions)
 */
commander_1.program
    .command("add <package>")
    .description("Add a package")
    .action(add_1.addPackage);
/**
 * Resolves the full dependency list from package.json and downloads all of the required packages to the “node_modules” folder
 *
 * This command has no arguments
 */
commander_1.program
    .command("install")
    .description("Install dependencies")
    .action(install_1.installAllDependencies);
commander_1.program.parse(process.argv);
//# sourceMappingURL=index.js.map