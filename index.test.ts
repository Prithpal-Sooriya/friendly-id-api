import { describe, expect, it } from 'bun:test'
import { addTest } from '.'

describe('Example tests', () => {
    it('positive additions', () => {
        expect(addTest(1, 2)).toBe(3)
        expect(addTest(2, 1)).toBe(3)
        expect(addTest(1, 3)).toBe(4)
    })
})