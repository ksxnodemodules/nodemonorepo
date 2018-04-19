import * as yargs from 'yargs'
import dataUsage from './data/usage'
import cmdVersionManagement from './cmd/version-management'

yargs
  .usage(dataUsage)
  .command(cmdVersionManagement)
  .demandCommand()
  .help()
  .argv
