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
const add_1 = require("../commands/add");
const paths_1 = require("../util/paths");
describe("npm add function", () => {
    it("should add package to package.json with exact version", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, add_1.addPackage)("is-fourteen@0.0.14");
        const packageJson = JSON.parse(yield fs_1.default.promises.readFile(paths_1.packageJsonPath, "utf8"));
        expect(packageJson.dependencies["is-fourteen"]).toBe("0.0.14");
    }));
    it.only("should add package with latest version", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, add_1.addPackage)("is-thirteen");
        const packageJson = JSON.parse(yield fs_1.default.promises.readFile(paths_1.packageJsonPath, "utf8"));
        expect(packageJson.dependencies["is-thirteen"]).toBe("2.0.0"); // hasn't changed in 8 years
    }));
});
//# sourceMappingURL=add.test.js.map