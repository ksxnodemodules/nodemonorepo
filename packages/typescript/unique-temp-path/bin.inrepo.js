#! /usr/bin/env node
const [prefix, suffix] = require('process').argv.slice(2)
const { tempPath } = require('./index')
const result = tempPath(prefix, suffix)
console.info(result)
