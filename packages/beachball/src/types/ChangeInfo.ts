export type ChangeType = 'prerelease' | 'patch' | 'minor' | 'major' | 'none';

export interface ChangeInfo {
  type: ChangeType;
  comment: string;
  packageName: string;
  email: string;
  date: Date;
  dependentChangeType?: ChangeType;
  commit?: string;
}

export type ChangeSet = Map<string, ChangeInfo>;
