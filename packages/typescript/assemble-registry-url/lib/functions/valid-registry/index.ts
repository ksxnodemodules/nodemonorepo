import { parse } from 'url'
export = (registry: string) => Boolean(parse(registry).protocol)
