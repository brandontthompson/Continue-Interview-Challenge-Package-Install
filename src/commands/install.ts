import fs from "fs";
import { Dependency } from "../types";
import { getPackageInfo, installPackages } from "../util/download";
import {
  nodeModulesPath,
  packageJsonPath,
  packageLockJsonPath,
} from "../util/paths";
import { IPackageLock } from "../util/packagelockjson";

export async function installAllDependencies() {
  console.log("Installing dependencies...");

  // Delete the node_modules folder if it exists - we always install from scratch
  if (fs.existsSync(nodeModulesPath)) {
    fs.rmSync(nodeModulesPath, { recursive: true });
  }
  fs.mkdirSync(nodeModulesPath);

  // Get top-level dependencies from package.json
  const topLevelDependencies = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf8")
  ).dependencies;

  // -------------------------------------------------
  // TODO -> Determine the full list of dependencies to download
  const dependenciesToDownload: Dependency[] = [];
  const lockfile: IPackageLock = {};

  for (const [name, version] of Object.entries<string>(topLevelDependencies)) {
    await resolveDependencies(name, version, dependenciesToDownload, lockfile);
  }

  if (fs.existsSync(packageLockJsonPath)) {
    fs.rmSync(packageLockJsonPath);
  }
  fs.writeFileSync(packageLockJsonPath, JSON.stringify(lockfile, null, 2));

  // -------------------------------------------------

  await installPackages(dependenciesToDownload);
}

async function resolveDependencies(
  name: string,
  version: string,
  dependenciesToDownload: Dependency[] = [],
  lockfile: IPackageLock,
  parent: string[] = []
): Promise<void> {
  // Check if one of the parents includes the current package
  // we could try some strategy of abstraction to resolve these dependencies but that is out of scope and likely on the package author
  // https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de
  if (parent.includes(name)) {
    console.warn(`Circular dependency: ${parent.join(" -> ")} -> ${name}`);
    return;
  }

  const packageInfo = await getPackageInfo({ name, version });

  if (packageInfo.name === undefined) {
    return;
  }

  if (lockfile[`${name}@${packageInfo.version}`]) {
    return;
  }

  // would like to consider flatting the node_modules
  // this would help improve storage performance as well as overall performace
  // we could also use version ranging to detect if already installed packages will staisfy the requirements
  // https://medium.com/@sdboyer/so-you-want-to-write-a-package-manager-4ae9c17d9527
  // https://www.youtube.com/watch?v=kPuGS4_9mRc

  dependenciesToDownload.push({
    name: packageInfo.name,
    version: packageInfo.version || "*",
    parent: parent,
  });

  lockfile[`${name}@${packageInfo.version || "*"}`] = {
    dependencies: {
      ...packageInfo.dependencies,
    },
  };

  // recurse to get all the dependencies and resolve them
  if (packageInfo.dependencies !== undefined) {
    for (const [dependencyName, dependencyVersion] of Object.entries<string>(
      packageInfo.dependencies
    )) {
      await resolveDependencies(
        dependencyName,
        dependencyVersion,
        dependenciesToDownload,
        lockfile,
        [...parent, name]
      );
    }
  }
}
