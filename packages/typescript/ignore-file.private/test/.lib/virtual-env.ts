import * as xjest from 'extra-jest'
import * as data from './data'

export const tree = data.tree
export const virtualEnvironment = xjest.setupTeardown.virtualEnvironment.createFactory(tree)
export default virtualEnvironment
