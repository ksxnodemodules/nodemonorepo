import * as yargs from 'yargs'
import dataUsage from './data/usage'
import cmdVersionManagement from './cmd/version-management'
import validate from './cmd/validate'
import publish from './cmd/publish'

yargs
  .usage(dataUsage)
  .command(cmdVersionManagement)
  .command(validate)
  .command(publish)
  .demandCommand()
  .help()
  .argv
