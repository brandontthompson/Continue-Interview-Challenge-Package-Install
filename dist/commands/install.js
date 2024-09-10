"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installAllDependencies = void 0;
const fs_1 = __importDefault(require("fs"));
const download_1 = require("../util/download");
const paths_1 = require("../util/paths");
function installAllDependencies() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Installing dependencies...");
        // Delete the node_modules folder if it exists - we always install from scratch
        if (fs_1.default.existsSync(paths_1.nodeModulesPath)) {
            fs_1.default.rmSync(paths_1.nodeModulesPath, { recursive: true });
        }
        fs_1.default.mkdirSync(paths_1.nodeModulesPath);
        // Get top-level dependencies from package.json
        const topLevelDependencies = JSON.parse(fs_1.default.readFileSync(paths_1.packageJsonPath, "utf8")).dependencies;
        // -------------------------------------------------
        // TODO -> Determine the full list of dependencies to download
        const dependenciesToDownload = [];
        const lockfile = {};
        for (const [name, version] of Object.entries(topLevelDependencies)) {
            yield resolveDependencies(name, version, dependenciesToDownload, lockfile);
        }
        if (fs_1.default.existsSync(paths_1.packageLockJsonPath)) {
            fs_1.default.rmSync(paths_1.packageLockJsonPath);
        }
        fs_1.default.writeFileSync(paths_1.packageLockJsonPath, JSON.stringify(lockfile, null, 2));
        // -------------------------------------------------
        yield (0, download_1.installPackages)(dependenciesToDownload);
    });
}
exports.installAllDependencies = installAllDependencies;
function resolveDependencies(name_1, version_1) {
    return __awaiter(this, arguments, void 0, function* (name, version, dependenciesToDownload = [], lockfile, parent = []) {
        if (parent.includes(name)) {
            console.warn(`Circular dependency: ${parent.join(" -> ")} -> ${name}`);
            return;
        }
        const packageInfo = yield (0, download_1.getPackageInfo)({ name, version });
        if (packageInfo.name === undefined) {
            return;
        }
        if (lockfile[`${name}@${packageInfo.version}`]) {
            return;
        }
        dependenciesToDownload.push({
            name: packageInfo.name,
            version: packageInfo.version || "*",
            parent: parent,
        });
        lockfile[`${name}@${packageInfo.version || "*"}`] = {
            dependencies: Object.assign({}, packageInfo.dependencies),
        };
        if (packageInfo.dependencies !== undefined) {
            for (const [dependencyName, dependencyVersion] of Object.entries(packageInfo.dependencies)) {
                yield resolveDependencies(dependencyName, dependencyVersion, dependenciesToDownload, lockfile, [...parent, name]);
            }
        }
    });
}
//# sourceMappingURL=install.js.map