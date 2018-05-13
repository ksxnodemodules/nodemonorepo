import * as yargs from 'yargs'
import dataUsage from './data/usage'
import cmdManifest from './cmd/manifest'
import cmdVersionManagement from './cmd/version-management'
import cmdDependencyManagement from './cmd/dependency-management'
import cmdValidate from './cmd/validate'
import cmdPublish from './cmd/publish'

yargs
  .usage(dataUsage)
  .command(cmdManifest)
  .command(cmdVersionManagement)
  .command(cmdDependencyManagement)
  .command(cmdValidate)
  .command(cmdPublish)
  .demandCommand()
  .help()
  .argv
