import * as _ from 'lodash';
import { Extension } from '@console/plugin-sdk';
import { FlagsObject } from '@console/internal/reducers/features';

type DashboardExtension = Extension<{ required: string | string[] }>;

export const getFlagsForExtensions = (extensions: DashboardExtension[]): string[] =>
  extensions.reduce(
    (requiredFlags, e) => _.uniq([...requiredFlags, ..._.castArray(e.properties.required)]),
    [] as string[],
  );

export const isDashboardExtensionInUse = (e: DashboardExtension, flags: FlagsObject) => {
  const requiredFlags = _.castArray(e.properties.required);
  return _.every(requiredFlags, (f) => flags[f]);
};
