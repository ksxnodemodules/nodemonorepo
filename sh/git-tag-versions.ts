import * as path from 'path'
import * as process from 'process'
import * as childProcess from 'child_process'
import * as wrkspc from 'nested-workspace-helper.private'

main().then(
  code => process.exit(code),
  error => {
    console.error(error)
    process.exit(1)
  }
)

async function main (): Promise<number> {
  const projdir = path.resolve(__dirname, '..')
  const {publishables} = await wrkspc.classifyPublishability(projdir)

  let finalStatus = 0
  for (const item of publishables) {
    const {name, version} = item.manifestContent
    const tag = `${name}-v${version}`
    console.info(`$ git tag ${tag}`)

    const {error, signal, status} = childProcess.spawnSync(
      'git',
      ['tag', tag],
      {
        cwd: projdir,
        stdio: 'inherit'
      }
    )

    if (error) throw error

    if (status) {
      console.error({signal, status})
      finalStatus |= status
    }
  }

  return finalStatus
}
