import { setPropertyPath, deletePropertyPath } from '@tsfun/object'

export type ActionChoice = 'set' | 'delete' | 'assign'
export type ActionFunction = (manifest: object, path: string[], value?: any) => object

export function getActionFunction (action: ActionChoice): ActionFunction {
  switch (action) {
    case 'set':
      return (object, path, value) =>
        setPropertyPath(object, path, value)
    case 'delete':
      return (object, path) =>
        deletePropertyPath(object, path)
    case 'assign':
      return (object, path, value) =>
        setPropertyPath(object, path, {
          // ...getPropertyPath(object, path), // think about this more
          ...value
        })
  }
}

export default getActionFunction
