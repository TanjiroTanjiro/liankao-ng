
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProblemList, getProblemDetail, voteProblem } from '../../src/api/problem'
import request from '../../src/utils/request'

// Mock request module
vi.mock('../../src/utils/request')

describe('Problem API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProblemList', () => {
    it('should call problem list API with correct parameters', async () => {
      const mockParams = {
        page: 1,
        pageSize: 20,
        order: 'desc'
      }
      const mockResponse = {
        data: {
          success: true,
          data: {
            items: [
              {
                id: 1,
                name: 'Test Problem',
                description: 'Test Description',
                difficulties: 3.5,
                qualities: 4.5
              }
            ],
            total: 1,
            page: 1,
            pageSize: 20,
            totalPages: 1
          }
        }
      }
      request.mockResolvedValue(mockResponse)

      await getProblemList(mockParams)

      expect(request).toHaveBeenCalledWith({
        url: '/problem/list',
        method: 'get',
        params: mockParams
      })
    })

    it('should return paginated problem list', async () => {
      const mockParams = {
        page: 1,
        pageSize: 20
      }
      const mockResponse = {
        success: true,
        data: {
          items: [
            {
              id: 1,
              name: 'Test Problem',
              description: 'Test Description',
              difficulties: 3.5,
              qualities: 4.5
            }
          ],
          total: 1,
          page: 1,
          pageSize: 20,
          totalPages: 1
        }
      }
      request.mockResolvedValue(mockResponse)

      const result = await getProblemList(mockParams)

      expect(result).toEqual(mockResponse)
    })

    it('should handle API error', async () => {
      const mockError = new Error('Failed to fetch problem list')
      request.mockRejectedValue(mockError)

      await expect(getProblemList({})).rejects.toThrow('Failed to fetch problem list')
    })
  })

  describe('getProblemDetail', () => {
    it('should call problem detail API with correct ID', async () => {
      const problemId = 1
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: 1,
            name: 'Test Problem',
            description: 'Test Description',
            difficulties: 3.5,
            qualities: 4.5,
            contestIds: [1, 2]
          }
        }
      }
      request.mockResolvedValue(mockResponse)

      await getProblemDetail(problemId)

      expect(request).toHaveBeenCalledWith({
        url: `/problem/${problemId}`,
        method: 'get'
      })
    })

    it('should return problem detail', async () => {
      const problemId = 1
      const mockResponse = {
        success: true,
        data: {
          id: 1,
          name: 'Test Problem',
          description: 'Test Description',
          difficulties: 3.5,
          qualities: 4.5,
          contestIds: [1, 2]
        }
      }
      request.mockResolvedValue(mockResponse)

      const result = await getProblemDetail(problemId)

      expect(result).toEqual(mockResponse)
    })

    it('should handle API error', async () => {
      const mockError = new Error('Problem not found')
      request.mockRejectedValue(mockError)

      await expect(getProblemDetail(999)).rejects.toThrow('Problem not found')
    })
  })

  describe('voteProblem', () => {
    it('should call vote problem API with correct parameters', async () => {
      const problemId = 1
      const score = 5
      const mockResponse = {
        data: {
          success: true
        }
      }
      request.mockResolvedValue(mockResponse)

      await voteProblem(problemId, score)

      expect(request).toHaveBeenCalledWith({
        url: `/vote/problem/${problemId}`,
        method: 'post',
        data: { x: score }
      })
    })

    it('should return success response', async () => {
      const problemId = 1
      const score = 5
      const mockResponse = {
        success: true
      }
      request.mockResolvedValue(mockResponse)

      const result = await voteProblem(problemId, score)

      expect(result).toEqual(mockResponse)
    })

    it('should handle API error', async () => {
      const mockError = new Error('Failed to vote')
      request.mockRejectedValue(mockError)

      await expect(voteProblem(999, 5)).rejects.toThrow('Failed to vote')
    })
  })
})
