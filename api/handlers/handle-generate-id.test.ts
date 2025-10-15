import { beforeEach, describe, expect, it, spyOn, jest } from 'bun:test'
import { handleGenerateId } from './handle-generate-id'
import * as DBCacheModule from '../db/cache'
import * as GenerateIdModule from '../../mm-friendly-id'
import { GenerateIdError } from '../errors/GenerateIdError'

describe(handleGenerateId.name, () => {
    beforeEach(() => jest.clearAllMocks())

    const arrangeMocks = () => ({
        mockInsertId: spyOn(DBCacheModule, 'insertId'),
        mockGenerateId: spyOn(GenerateIdModule, 'generateId').mockReturnValue('MM-foo-123')
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

    it('throws error if fails to insert if ID is already being used', () => {
        const mocks = arrangeMocks()
        mocks.mockInsertId.mockRestore() // remove mock calls
        const existingId = 'MM-existing-id'
        mocks.mockGenerateId.mockReturnValue(existingId)

        // Insert existing user
        DBCacheModule.insertId({ userSub: 'Existing-User', id: existingId })

        // Insert new user, that is using same Id for all retries.
        expect(() => handleGenerateId('New-User-Entering-Same-Id')).toThrowError(GenerateIdError)
        expect(mocks.mockGenerateId).toHaveBeenCalledTimes(3)
    })

    it('does not throw error if retries succeed', () => {
        const mocks = arrangeMocks()
        mocks.mockInsertId.mockRestore() // remove mock calls
        const existingId = 'MM-existing-id'
        mocks.mockGenerateId.mockReturnValueOnce(existingId) // Retry 1x Failed
        mocks.mockGenerateId.mockReturnValueOnce(existingId) // Retry 2x Failed
        mocks.mockGenerateId.mockReturnValueOnce('MM-new-Id') // Retry 3x Succeeded

        // Insert existing user
        DBCacheModule.insertId({ userSub: 'Existing-User', id: existingId })

        // Insert new user, that is using same Id which passed on 3rd retry
        const result = handleGenerateId('New-User-Entering-Same-Id')
        expect(result.status).toBe(200)
        expect(mocks.mockGenerateId).toHaveBeenCalledTimes(3)
    })

    it('throws error if fails to insert', () => {
        const mocks = arrangeMocks()
        mocks.mockInsertId.mockImplementation(() => {
            throw new Error('Mock Error')
        })
        expect(() => handleGenerateId(MOCK_SUB)).toThrowError()
    })
})