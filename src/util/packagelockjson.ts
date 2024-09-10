export interface IPackageLock {
  [field: string]: {
    // consider adding a version field here that wraps the dependecies
    // [version:string]: {}
    dependencies: {
      [field: string]: string;
    };
  };
}
