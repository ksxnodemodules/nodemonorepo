import * as xjest from 'extra-jest'

export const tree = require('../.data/fs.yaml')
export const virtualEnvironment = xjest.setupTeardown.virtualEnvironment.createFactory(tree)
export default virtualEnvironment
