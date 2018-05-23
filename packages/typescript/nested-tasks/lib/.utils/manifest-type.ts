import {Manifest} from '../.types'

export const MODULE = ['', '.js']
export const YAML = ['.json', '.yaml', '.yml']

export function getManifestType (ext: string): Manifest.Type | null {
  if (MODULE.includes(ext)) return 'module'
  if (YAML.includes(ext)) return 'yaml'
  return null
}

export default getManifestType
