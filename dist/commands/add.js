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
exports.addPackage = void 0;
const fs_1 = __importDefault(require("fs"));
const download_1 = require("../util/download");
const packageJson_1 = require("../util/packageJson");
const paths_1 = require("../util/paths");
function addPackage(pkg) {
    return __awaiter(this, void 0, void 0, function* () {
        let [packageName, version] = pkg.split("@");
        // If no specified version, or version is "latest", request latest version number
        if (!version || version === "latest") {
            const info = yield (0, download_1.getPackageInfo)({
                name: packageName,
                version: "latest",
            });
            version = info.version;
        }
        // Create output dir and package.json if not exist
        if (!fs_1.default.existsSync(paths_1.outputDir)) {
            fs_1.default.mkdirSync(paths_1.outputDir);
        }
        if (!fs_1.default.existsSync(paths_1.packageJsonPath)) {
            fs_1.default.writeFileSync(paths_1.packageJsonPath, JSON.stringify(packageJson_1.DEFAULT_PACKAGE_JSON, null, 2));
        }
        // Add package to package.json
        const packageJson = JSON.parse(fs_1.default.readFileSync(paths_1.packageJsonPath, "utf8"));
        packageJson.dependencies[packageName] = version || "latest";
        fs_1.default.writeFileSync(paths_1.packageJsonPath, JSON.stringify(packageJson, null, 2));
    });
}
exports.addPackage = addPackage;
//# sourceMappingURL=add.js.map