import * as path from 'path'
import {Repository} from 'git-ts'
import {listAllPackages} from 'nested-workspace-helper.private'

main().then(
  code => process.exit(code),
  error => {
    console.error(error)
    process.exit(1)
  }
)

async function main (): Promise<number> {
  const projdir = path.resolve(__dirname, '..')
  const pkgs = await listAllPackages(projdir)
  const tagman = new Repository.Tags(projdir)
  const allTags = tagman.getAllTags()

  let fails = 0
  for (const {manifestContent} of pkgs) {
    const {name, version, private: prv} = manifestContent
    if (prv) continue
    if (!name) continue

    const tag = `${name}-v${version}`
    if (allTags.includes(tag)) continue

    console.info(`$ git tag ${tag}`)

    try {
      tagman.addTag(tag)
    } catch (error) {
      console.error(error)
      ++fails
    }
  }

  return fails
}
