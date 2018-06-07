import * as api from '../../api'

export const exclusive: api.TaskParam =
  () => console.info('From script-only/exclusive')
