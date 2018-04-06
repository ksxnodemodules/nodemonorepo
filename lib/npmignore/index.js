'use strict'
const {resolve} = require('path')
const {readFileSync} = require('fs')

const rootArray = readFileSync(resolve(__dirname, '../../.npmignore'), 'utf8')
  .split(/\n|\r/)
  .filter(Boolean)
  .filter(x => !/^#/.test(x))

const rootString = rootArray.join('\n')

module.exports = {
  rootArray,
  rootString
}
