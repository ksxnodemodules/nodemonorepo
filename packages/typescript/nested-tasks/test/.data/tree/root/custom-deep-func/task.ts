import * as api from '../../api'

const fn: api.TaskParam =
  () => console.info('This should not appear (custom-deep-func/script)')

export = {
  ['custom-deep-func']: fn
}
