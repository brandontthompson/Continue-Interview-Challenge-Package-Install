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
exports.getPackageInfo = exports.installPackages = void 0;
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
const paths_1 = require("./paths");
const tar = require("tar");
function installPackages(dependencies) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const dep of dependencies) {
            yield installSinglePackage(dep);
        }
    });
}
exports.installPackages = installPackages;
function getPackageInfo(dep) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dep.name || !dep.version) {
            throw new Error("Invalid dependency object");
        }
        const absoluteVersion = (dep.version.startsWith("^") ? dep.version.slice(1) : dep.version).split(" ")[0];
        const resp = yield fetch(`https://registry.npmjs.org/${dep.name}/${absoluteVersion}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });
        const data = yield resp.json();
        return data;
    });
}
exports.getPackageInfo = getPackageInfo;
function downloadToNodeModules(dep, shasum) {
    return __awaiter(this, void 0, void 0, function* () {
        // Construct the download URL
        const url = `https://registry.npmjs.org/${dep.name}/-/${dep.name}-${dep.version}.tgz`;
        let targetPath = paths_1.nodeModulesPath;
        if (dep.parent) {
            targetPath = dep.parent.reduce((acc, parent) => {
                return path_1.default.join(acc, parent, "node_modules");
            }, paths_1.nodeModulesPath);
        }
        console.log(targetPath);
        const tarballPath = path_1.default.join(targetPath, `${dep.name.replace("@", "%40").replace("/", "%2F")}-${dep.version}.tgz`);
        fs_1.default.mkdirSync(targetPath, { recursive: true });
        // Download the tarball
        yield new Promise((resolve, reject) => {
            const fileStream = fs_1.default.createWriteStream(tarballPath);
            https_1.default
                .get(url, (response) => {
                response.pipe(fileStream);
                fileStream.on("finish", () => {
                    fileStream.close();
                    resolve(null);
                });
            })
                .on("error", (error) => {
                fileStream.close();
                fs_1.default.unlink(tarballPath, () => { }); // Delete the file if an error occurs
                console.error(`Error downloading package ${dep.name}@${dep.version}:`, error);
                reject(error);
            });
        });
        // Extract the tarball
        try {
            yield tar.extract({
                file: tarballPath,
                cwd: targetPath,
            });
        }
        catch (e) {
            console.error(`Error extracting package ${dep.name}@${dep.version}:`, e);
            return;
        }
        finally {
            // Delete the tarball
            fs_1.default.unlinkSync(tarballPath);
        }
        // Move to target directory
        const extracted = path_1.default.join(targetPath, "package");
        const destPath = path_1.default.join(targetPath, dep.name);
        console.log(destPath);
        fs_1.default.renameSync(extracted, destPath);
    });
}
function installSinglePackage(dep) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Installing ${dep.name}@${dep.version}...`);
        try {
            const data = yield getPackageInfo(dep);
            yield downloadToNodeModules(Object.assign(Object.assign({}, dep), { version: data.version }), data.dist.shasum);
        }
        catch (e) {
            console.error(`Error installing package ${dep.name}@${dep.version}:`, e);
            return;
        }
    });
}
//# sourceMappingURL=download.js.map