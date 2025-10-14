import { describe, expect, it, mock } from 'bun:test'

import { generateId, isMaxIdLength } from './mm-friendly-id'

const REPETITIONS = 1000
const itMultiple = (testName: string, test: () => void) => {
  it(testName, () => {
    for (let index = 0; index < REPETITIONS; index++) {
      test()
    }
  })
}

describe(generateId.name, () => {
  it('generates a friendly id', () => {
    const result = generateId()
    expect(result).toStartWith('MM-')
    expect(result).toMatch(/\d\d\d$/)
  })

  it('generates specific Id for exact match', async () => {
    mock.module('./nouns/short-nouns.json', () => ({ default: ['foo'] }))
    const result = generateId()
    expect(result).toMatch(/^MM-foo-\d\d\d$/)
  })

  itMultiple('generates Ids within BLE (legacy) 31 Bytes', () => {
    const result = generateId()
    expect(result.length <= 31).toBe(true)
  })
})

describe(isMaxIdLength.name, () => {
  itMultiple('validates max id length for friendly id', () => {
    const result = generateId()
    expect(isMaxIdLength(result)).toBe(true)
  })
})