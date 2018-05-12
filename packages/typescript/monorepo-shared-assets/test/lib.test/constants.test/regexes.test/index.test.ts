import {constants} from '../../../../index'
import { versionRequirement } from '../../../../lib/constants/regexes';
const {regexes} = constants

const createMatcher = (regex: RegExp) => ({
  matches: (x: string) => it(x, () => expect(x).toMatch(regex)),
  not: {
    matches: (x: string) => it(x, () => expect(x).not.toMatch(regex))
  }
})

describe('VERSION', () => {
  const {matches, not} = createMatcher(regexes.VERSION)

  describe('matches', () => {
    ; ['0.0.0', '1.2.3', '3.2.1'].forEach(matches)
  })

  describe('does not matches', () => {
    ; [
      'a.b.c',
      'x.y.z',
      '0.1.x',
      '0.x.x',
      'x.x.x',
      'totallyInvalid'
    ].forEach(not.matches)
  })
})

describe('versionRequirement.ANY', () => {
  const {matches, not} = createMatcher(versionRequirement.ANY)

  describe('matches', () => {
    ; ['*', 'x.x.x'].forEach(matches)
  })

  describe('does not matches', () => {
    ; ['1.2.3', '=1.2.3', '~1.2.3', '^1.2.3'].forEach(not.matches)
  })
})

describe('versionRequirement.EQUAL', () => {
  const {matches, not} = createMatcher(versionRequirement.EQUAL)

  describe('matches', () => {
    ; [
      '1.2.3',
      '=1.2.3',
      '1.2.3-beta',
      '=1.2.3-rc',
      '123.456.789-alpha',
      '=123.456.789-alpha'
    ].forEach(matches)
  })

  describe('does not matches', () => {
    ; ['*', 'x.x.x', '~1.2.3', '^1.2.3'].forEach(not.matches)
  })
})

describe('versionRequirement.TILDA', () => {
  const {matches, not} = createMatcher(versionRequirement.TILDA)

  describe('matches', () => {
    ; ['~1.2.3', '~1.2.3-beta', '~123.456.789-alpha'].forEach(matches)
  })

  describe('does not matches', () => {
    ; ['*', 'x.x.x', '1.2.3', '=1.2.3', '^1.2.3'].forEach(not.matches)
  })
})

describe('versionRequirement.CARET', () => {
  const {matches, not} = createMatcher(versionRequirement.CARET)

  describe('matches', () => {
    ; ['^1.2.3', '^1.2.3-beta', '^123.456.789-alpha'].forEach(matches)
  })

  describe('does not matches', () => {
    ; ['*', 'x.x.x', '1.2.3', '=1.2.3', '~1.2.3'].forEach(not.matches)
  })
})

describe('versionRequirement.PATCH', () => {
  const {matches, not} = createMatcher(versionRequirement.PATCH)

  describe('matches', () => {
    ; ['1.2.x', '123.456.x'].forEach(matches)
  })

  describe('does not matches', () => {
    ; ['*', 'x.x.x', '1.x.x'].forEach(not.matches)
  })
})

describe('versionRequirement.MINOR', () => {
  const {matches, not} = createMatcher(versionRequirement.MINOR)

  describe('matches', () => {
    ; ['1.x.x', '123.x.x'].forEach(matches)
  })

  describe('does not matches', () => {
    ; ['*', 'x.x.x', '1.2.x'].forEach(not.matches)
  })
})

describe('versionRequirement.MAJOR', () => {
  const {matches, not} = createMatcher(versionRequirement.MAJOR)

  describe('matches', () => {
    matches('x.x.x')
  })

  describe('does not matches', () => {
    ; ['*', '1.x.x', '1.2.x'].forEach(not.matches)
  })
})
