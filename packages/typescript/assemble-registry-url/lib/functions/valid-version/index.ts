import { valid } from 'semver'
export = (version: string) => Boolean(valid(version))
