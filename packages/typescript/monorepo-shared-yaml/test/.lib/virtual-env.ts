import * as xjest from 'extra-jest'

export const createVirtualEnvironment = (file: string) =>
  xjest.setupTeardown.virtualEnvironment.createFactory(require(`../.data/${file}`))

export default createVirtualEnvironment
