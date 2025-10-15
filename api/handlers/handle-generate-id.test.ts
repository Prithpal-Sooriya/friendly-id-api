import { describe, expect, it, spyOn } from 'bun:test'
import { handleGenerateId } from './handle-generate-id'
import * as DBCacheModule from '../db/cache'

describe(handleGenerateId.name, () => {
    const arrangeMocks = () => ({
        mockInsertId: spyOn(DBCacheModule, 'insertId')
    })

    const MOCK_SUB = 'MOCK_SUB'

    it('inserts and returns a good response', () => {
        const mocks = arrangeMocks()
        const result = handleGenerateId(MOCK_SUB);
        expect(mocks.mockInsertId).toHaveBeenCalledWith({
            userSub: MOCK_SUB,
            id: expect.any(String)
        })
        expect(result.status).toBe(200)
    })

    it('throws error if fails to insert', () => {
        const mocks = arrangeMocks()
        mocks.mockInsertId.mockImplementation(() => {
            throw new Error('Mock Error')
        })
        expect(() => handleGenerateId(MOCK_SUB)).toThrowError()
    })

})