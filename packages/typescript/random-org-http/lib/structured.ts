import {Response} from 'node-fetch'

import {
  structured as Structured,
  raw as Raw,
  Activation,
  Base,
  Format
} from './types'

import * as raw from './raw'

const {hexadecimal} = Base
const format = Format.plain
const whitespace = /\s+/

const parseNumbers = (text: string, radix?: Base) =>
  text.split(whitespace).filter(Boolean).map(x => parseInt(x, radix))

const convertActivation =
  (x = false) => x ? Activation.on : Activation.off

export class FetchError extends Error {
  readonly response: Response

  constructor (message: string, response: Response) {
    super(message)
    this.response = response
  }

  get name () {
    return 'FetchError'
  }

  static async check (response: Response) {
    if (response.ok) return
    const text = await response.text()
    const message = text ? text : `status: ${response.status} ${response.statusText}`
    throw new FetchError(message, response)
  }
}

export async function integers (query: Structured.Param.Integer) {
  const base = hexadecimal

  const response = await raw.integers({
    ...query,
    col: 1,
    base,
    format
  })

  await FetchError.check(response)

  return parseNumbers(await response.text(), base)
}

export async function sequences (query: Structured.Param.Sequence) {
  const response = await raw.sequences({
    ...query,
    col: 1,
    format
  })

  await FetchError.check(response)

  return parseNumbers(await response.text())
}

export async function strings (query: Structured.Param.String) {
  const {
    num,
    len,
    digits,
    loweralpha,
    upperalpha,
    unique
  } = query

  const response = await raw.strings({
    num,
    len,
    digits: convertActivation(digits),
    loweralpha: convertActivation(loweralpha),
    upperalpha: convertActivation(upperalpha),
    unique: convertActivation(unique),
    format
  } as Raw.Param.String)

  await FetchError.check(response)

  return (await response.text())
    .split(whitespace)
    .filter(Boolean)
}
