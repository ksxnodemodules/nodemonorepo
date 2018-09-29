import * as base from 'js-yaml'
import subject, { yaml } from '../index'

it('default export contains js-yaml', () => {
  expect(subject).toEqual(expect.objectContaining(base))
})

it('export js-yaml as yaml', () => {
  expect(yaml).toEqual(base)
})
