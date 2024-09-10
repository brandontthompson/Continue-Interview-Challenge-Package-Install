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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const packageJson_1 = require("../util/packageJson");
const paths_1 = require("../util/paths");
const install_1 = require("./install");
describe("npm install function", () => {
    it("should install is-thirteen", () => __awaiter(void 0, void 0, void 0, function* () {
        // Hardcode package.json to include only is-thirteen
        if (!paths_1.outputDir) {
            fs_1.default.mkdirSync(paths_1.outputDir);
        }
        fs_1.default.writeFileSync(paths_1.packageJsonPath, JSON.stringify(Object.assign(Object.assign({}, packageJson_1.DEFAULT_PACKAGE_JSON), { dependencies: {
                "is-thirteen": "2.0.0",
            } }), undefined, 2));
        // Run install command
        yield (0, install_1.installAllDependencies)();
        // Check that is-thirteen is installed
        const p = path_1.default.join(paths_1.nodeModulesPath, "is-thirteen");
        expect(fs_1.default.existsSync(p)).toBe(true);
        const isThirteenPackageJson = JSON.parse(fs_1.default.readFileSync(path_1.default.join(p, "package.json"), "utf8"));
        expect(isThirteenPackageJson.version).toBe("2.0.0");
    }));
});
//# sourceMappingURL=install.test.js.map