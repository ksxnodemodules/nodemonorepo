'use strict'
const subject = require('./index')
const xjest = require('extra-jest')

it('matches snapshot', xjest.snap.unsafe(subject))
