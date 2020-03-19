import { ChangeSet, ChangeInfo } from '../types/ChangeInfo';
import { getChangePath } from '../paths';
import fs from 'fs-extra';
import path from 'path';
import { BeachballOptions } from '../types/BeachballOptions';
import { getScopedPackages } from '../monorepo/getScopedPackages';
import { getCurrentHash } from '../git';

export function readChangeFiles(options: BeachballOptions) {
  const { path: cwd } = options;
  const scopedPackages = getScopedPackages(options);
  const changeSet: ChangeSet = new Map();
  const changePath = getChangePath(cwd);
  if (!changePath || !fs.existsSync(changePath)) {
    return changeSet;
  }
  const changeFiles = fs.readdirSync(changePath);
  changeFiles.forEach(changeFile => {
    try {
      const changeJson: ChangeInfo = JSON.parse(fs.readFileSync(path.join(changePath, changeFile)).toString());
      changeJson.commit = getCurrentHash(changePath) || 'hash not available';
      const packageName = changeJson.packageName;

      if (scopedPackages.includes(packageName)) {
        changeSet.set(changeFile, changeJson);
      } else {
        console.log(`Skipping reading change file for out-of-scope package ${packageName}`);
      }
    } catch (e) {
      console.warn(`Invalid change file detected: ${changeFile}`);
    }
  });
  return changeSet;
}
