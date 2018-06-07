import * as api from '../api'

namespace shortcut {
  export const shell: api.TaskParam.Shortcut.Shell =
    'echo This is a shell command (script/@shortcut/shell)'

  export const spawn: api.TaskParam.Shortcut.Spawn = [
    'echo',
    'This is a spawned command',
    '(script/@shortcut/spawm)'
  ]

  export const func: api.TaskParam.Shortcut.Function = () => {
    console.info('This is a function call (script/@shortcut/func)')
  }
}

namespace keyword {
  export const shell: api.TaskParam.Keyword.Shell = {
    cmd: 'echo This is a shell command (script/@keyword/shell)'
  }

  export const spawn: api.TaskParam.Keyword.Spawn = {
    spawn: [
      'echo',
      'This is a spawned command',
      '(script/@keyword/spawn)'
    ]
  }

  export const func: api.TaskParam.Keyword.Function = {
    execute () {
      console.info('This is a function call (script/@keyword/func)')
    }
  }
}

namespace partialDetailed {
  export const shell: api.TaskParam.Detailed.Shell = {
    shell: 'sh',
    cmd: 'echo This is a shell command (script/@partial-detailed/shell)'
  }

  export const spawn: api.TaskParam.Detailed.Spawn = {
    program: 'echo',
    argv: [
      'This is a spawned command',
      '(script/@partial-detailed/spawn)'
    ]
  }

  export const func: api.TaskParam.Detailed.Function = {
    execute () {
      console.info('This is a function call (script/@partial-detailed/func)')
    }
  }
}

namespace fullDetailed {
  export const shell: api.TaskParam.Detailed.Shell = {
    type: 'shell',
    shell: 'sh',
    cmd: 'echo This is a shell command (script/@full-detailed/shell)'
  }

  export const spawn: api.TaskParam.Detailed.Spawn = {
    type: 'spawn',
    program: 'echo',
    argv: [
      'This is a spawned command',
      '(script/@full-detailed/spawn)'
    ]
  }

  export const func: api.TaskParam.Detailed.Function = {
    type: 'function',
    execute () {
      console.info('This is a function call (script/@full-detailed/func)')
    }
  }
}

namespace group {
  export const shell: api.TaskParam =
    'echo Shell within a group (script/@group/shell)'

  export const spawn: api.TaskParam = [
    'echo',
    'Spawn within a group',
    '(script/@group/spawn)'
  ]

  export const func: api.TaskParam = () => {
    console.info('Function within a group (script/@group/spawn)')
  }
}

const out: api.TaskSetManifest = {
  ['@shortcut']: shortcut,
  ['@keyword']: keyword,
  ['@partial-detailed']: partialDetailed,
  ['@full-detailed']: fullDetailed,
  ['@group']: group
}

export = out
