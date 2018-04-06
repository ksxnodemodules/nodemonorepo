'use strict'
const subject = require('./index')

it('matches snapshot', () => {
  expect(subject).toMatchSnapshot()
})
