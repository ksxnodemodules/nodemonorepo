import {Response} from 'node-fetch'

import {
  structured as Structured,
  Base,
  Format
} from './types'

import * as raw from './raw'

const {hexadecimal} = Base
const format = Format.plain
const whitespace = /\s+/

const parseNumbers = (text: string, radix?: Base) =>
  text.split(whitespace).filter(Boolean).map(x => parseInt(x, radix))

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

export async function integer (query: Structured.Param.Integer) {
  const base = hexadecimal

  const response = await raw.integer({
    ...query,
    col: 1,
    base,
    format
  })

  await FetchError.check(response)

  return parseNumbers(await response.text(), base)
}

export async function sequence (query: Structured.Param.Sequence) {
  const response = await raw.sequence({
    ...query,
    col: 1,
    format
  })

  await FetchError.check(response)

  return parseNumbers(await response.text())
}

export async function string (query: Structured.Param.String) {
  const response = await raw.string({
    ...query,
    format
  })

  await FetchError.check(response)

  return (await response.text()).split(whitespace)
}
