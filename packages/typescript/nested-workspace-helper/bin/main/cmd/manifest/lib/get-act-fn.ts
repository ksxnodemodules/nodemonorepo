import ramda from 'ramda'

export type ActionChoice = 'set' | 'delete' | 'assign'
export type ActionFunction = (manifest: object, path: string[], value?: any) => object

export function getActionFunction (action: ActionChoice): ActionFunction {
  switch (action) {
    case 'set':
      return (object, path, value) =>
        ramda.assocPath(path, value, object)
    case 'delete':
      return (object, path) =>
        ramda.dissocPath(path, object)
    case 'assign':
      return (object, path, value) =>
        ramda.assocPath(path, {...ramda.path(path) || {}, ...value}, object)
  }
}

export default getActionFunction
