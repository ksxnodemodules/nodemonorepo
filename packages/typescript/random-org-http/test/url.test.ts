import {url, types} from '../index'
import Param = types.raw.Param
import Radix = types.Base
import Format = types.Format
import Activation = types.Activation

const {integers, sequences, strings} = url.create

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

it('integers', () => {
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
      min: -10,
      max: 20,
      num: 7,
      format: Format.html
    }
  ]

  const result = mksmpl(integers, params)

  expect(result).toMatchSnapshot()
})

it('sequences', () => {
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

  const result = mksmpl(sequences, params)

  expect(result).toMatchSnapshot()
})

it('strings', () => {
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
      len: 15,
      digits: Activation.on,
      loweralpha: Activation.on,
      upperalpha: Activation.on,
      unique: Activation.on,
      format: Format.html
    },
    {
      num: 9,
      len: 19,
      digits: Activation.on,
      loweralpha: Activation.off,
      upperalpha: Activation.off,
      unique: Activation.off,
      format: Format.plain
    }
  ]

  const result = mksmpl(strings, params)

  expect(result).toMatchSnapshot()
})
