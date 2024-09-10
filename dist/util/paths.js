"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheManifestPath = exports.globalCachePath = exports.nodeModulesPath = exports.packageLockJsonPath = exports.packageJsonPath = exports.outputDir = void 0;
const path_1 = __importDefault(require("path"));
exports.outputDir = path_1.default.join(process.cwd(), "output");
exports.packageJsonPath = path_1.default.join(exports.outputDir, "package.json");
exports.packageLockJsonPath = path_1.default.join(exports.outputDir, "package-lock.json");
exports.nodeModulesPath = path_1.default.join(exports.outputDir, "node_modules");
exports.globalCachePath = path_1.default.join(process.cwd(), "global-cache");
exports.cacheManifestPath = path_1.default.join(exports.globalCachePath, "manifest.json");
//# sourceMappingURL=paths.js.map