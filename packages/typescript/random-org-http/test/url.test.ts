import {url, types} from '../index'
import Param = types.raw.Param
import Radix = types.Base
import Format = types.Format
import Activation = types.Activation

const {integer, sequence, string} = url.create

const mksmpl =
  <Param, Result>(
    fn: (param: Param) => Result,
    params: ReadonlyArray<Param>
  ) => params.map(
    input => ({
      input,
      output: fn(input)
    })
  )

it('integer', () => {
  const params: Param.Integer[] = [
    {
      base: Radix.binary,
      col: 1,
      min: 1,
      max: 10,
      num: 8,
      format: Format.plain
    },
    {
      base: Radix.hexadecimal,
      col: 3,
      min: 10,
      max: 20,
      num: 7,
      format: Format.html
    }
  ]

  const result = mksmpl(integer, params)

  expect(result).toMatchSnapshot()
})

it('sequence', () => {
  const params: Param.Sequence[] = [
    {
      min: 1,
      max: 10,
      col: 2,
      format: Format.plain
    },
    {
      min: 2,
      max: 5,
      col: 3,
      format: Format.html
    }
  ]

  const result = mksmpl(sequence, params)

  expect(result).toMatchSnapshot()
})

it('string', () => {
  const params: Param.String[] = [
    {
      num: 1,
      len: 10,
      digits: Activation.on,
      loweralpha: Activation.off,
      upperalpha: Activation.on,
      unique: Activation.off,
      format: Format.plain
    },
    {
      num: 7,
      len: 22,
      digits: Activation.on,
      loweralpha: Activation.on,
      upperalpha: Activation.on,
      unique: Activation.on,
      format: Format.html
    },
    {
      num: 9,
      len: 32,
      digits: Activation.on,
      loweralpha: Activation.off,
      upperalpha: Activation.off,
      unique: Activation.off,
      format: Format.plain
    }
  ]

  const result = mksmpl(string, params)

  expect(result).toMatchSnapshot()
})
