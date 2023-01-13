import Debug from 'debug';

import { getOptionValue } from './cli';

const debug = Debug('@jigra/create-app:options');

export type Options = {
  [K in keyof OptionValues]: string | undefined;
};

export interface OptionValues {
  dir: string;
  name: string;
  'package-id': string;
}

export type Validators = {
  [K in keyof Required<OptionValues>]: (value: any) => string | true;
};

export const CLI_ARGS = ['dir'] as const;
export const CLI_OPTIONS = ['name', 'package-id'] as const;

export const VALIDATORS: Validators = {
  name: (value) =>
    typeof value !== 'string' || value.trim().length === 0 ? `Must provide an app name, e.g. "Spacebook"` : true,
  'package-id': (value) =>
    typeof value !== 'string' || value.trim().length === 0
      ? 'Must provide a Package ID, e.g. "com.example.app"'
      : /[A-Z]/.test(value)
      ? 'Must be lowercase'
      : /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/.test(value)
      ? true
      : `Must be in reverse-DNS format, e.g. "com.example.app"`,
  dir: (value) =>
    typeof value !== 'string' || value.trim().length === 0
      ? `Must provide a directory, e.g. "my-app"`
      : /^-/.test(value)
      ? 'Directories should not start with a hyphen.'
      : true,
};

export const getOptions = (): Options => {
  const argValues = CLI_ARGS.reduce((opts, option, i) => {
    const value = process.argv[i + 2];
    const validatorResult = VALIDATORS[option](value);

    if (typeof validatorResult === 'string') {
      debug(`invalid positional arg: %s %O: %s`, option, value, validatorResult);
    }

    opts[option] = validatorResult === true ? value : undefined;

    return opts;
  }, {} as Options);

  const optionValues = CLI_OPTIONS.reduce((opts, option) => {
    const value = getOptionValue(process.argv, `--${option}`);
    const validatorResult = VALIDATORS[option](value);

    if (typeof validatorResult === 'string') {
      debug(`invalid option: --%s %O: %s`, option, value, validatorResult);
    }

    opts[option] = validatorResult === true ? value : undefined;

    return opts;
  }, {} as Options);

  return { ...argValues, ...optionValues };
};
