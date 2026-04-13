
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getContestList, getContestDetail, getContestProblems, voteContest } from '../../src/api/contest'
import request from '../../src/utils/request'

// Mock request module
vi.mock('../../src/utils/request')

describe('Contest API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getContestList', () => {
    it('should call contest list API with correct parameters', async () => {
      const mockParams = {
        page: 1,
        pageSize: 20,
        order: 'desc'
      }
      const mockResponse = {
        success: true,
        data: {
          items: [
            {
              id: 1,
              name: 'Test Contest',
              description: 'Test Description',
              startTime: '2024-01-01T00:00:00Z',
              endTime: '2024-01-02T00:00:00Z',
              qualities: 4.5,
              type: 'online'
            }
          ],
          total: 1,
          page: 1,
          pageSize: 20,
          totalPages: 1
        }
      }
      request.mockResolvedValue(mockResponse)

      await getContestList(mockParams)

      expect(request).toHaveBeenCalledWith({
        url: '/contest/list',
        method: 'get',
        params: mockParams
      })
    })

    it('should return paginated contest list', async () => {
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
              name: 'Test Contest',
              description: 'Test Description',
              startTime: '2024-01-01T00:00:00Z',
              endTime: '2024-01-02T00:00:00Z',
              qualities: 4.5,
              type: 'online'
            }
          ],
          total: 1,
          page: 1,
          pageSize: 20,
          totalPages: 1
        }
      }
      request.mockResolvedValue(mockResponse)

      const result = await getContestList(mockParams)

      expect(result).toEqual(mockResponse)
    })

    it('should handle API error', async () => {
      const mockError = new Error('Failed to fetch contest list')
      request.mockRejectedValue(mockError)

      await expect(getContestList({})).rejects.toThrow('Failed to fetch contest list')
    })
  })

  describe('getContestDetail', () => {
    it('should call contest detail API with correct ID', async () => {
      const contestId = 1
      const mockResponse = {
        data: {
          success: true,
          data: {
            id: 1,
            name: 'Test Contest',
            description: 'Test Description',
            startTime: '2024-01-01T00:00:00Z',
            endTime: '2024-01-02T00:00:00Z',
            qualities: 4.5,
            type: 'online'
          }
        }
      }
      request.mockResolvedValue(mockResponse)

      await getContestDetail(contestId)

      expect(request).toHaveBeenCalledWith({
        url: `/contest/${contestId}`,
        method: 'get'
      })
    })

    it('should return contest detail', async () => {
      const contestId = 1
      const mockResponse = {
        success: true,
        data: {
          id: 1,
          name: 'Test Contest',
          description: 'Test Description',
          startTime: '2024-01-01T00:00:00Z',
          endTime: '2024-01-02T00:00:00Z',
          qualities: 4.5,
          type: 'online'
        }
      }
      request.mockResolvedValue(mockResponse)

      const result = await getContestDetail(contestId)

      expect(result).toEqual(mockResponse)
    })

    it('should handle API error', async () => {
      const mockError = new Error('Contest not found')
      request.mockRejectedValue(mockError)

      await expect(getContestDetail(999)).rejects.toThrow('Contest not found')
    })
  })

  describe('getContestProblems', () => {
    it('should call contest problems API with correct ID', async () => {
      const contestId = 1
      const mockResponse = {
        data: {
          success: true,
          data: [
            {
              id: 1,
              name: 'Problem 1',
              description: 'Problem Description',
              point: 100,
              order: 1
            }
          ]
        }
      }
      request.mockResolvedValue(mockResponse)

      await getContestProblems(contestId)

      expect(request).toHaveBeenCalledWith({
        url: `/contest/${contestId}/problems`,
        method: 'get'
      })
    })

    it('should return contest problems', async () => {
      const contestId = 1
      const mockResponse = {
        success: true,
        data: [
          {
            id: 1,
            name: 'Problem 1',
            description: 'Problem Description',
            point: 100,
            order: 1
          }
        ]
      }
      request.mockResolvedValue(mockResponse)

      const result = await getContestProblems(contestId)

      expect(result).toEqual(mockResponse)
    })

    it('should handle API error', async () => {
      const mockError = new Error('Failed to fetch contest problems')
      request.mockRejectedValue(mockError)

      await expect(getContestProblems(999)).rejects.toThrow('Failed to fetch contest problems')
    })
  })

  describe('voteContest', () => {
    it('should call vote contest API with correct parameters', async () => {
      const contestId = 1
      const score = 5
      const mockResponse = {
        data: {
          success: true
        }
      }
      request.mockResolvedValue(mockResponse)

      await voteContest(contestId, score)

      expect(request).toHaveBeenCalledWith({
        url: `/vote/contest/${contestId}`,
        method: 'post',
        data: { x: score }
      })
    })

    it('should return success response', async () => {
      const contestId = 1
      const score = 5
      const mockResponse = {
        success: true
      }
      request.mockResolvedValue(mockResponse)

      const result = await voteContest(contestId, score)

      expect(result).toEqual(mockResponse)
    })

    it('should handle API error', async () => {
      const mockError = new Error('Failed to vote')
      request.mockRejectedValue(mockError)

      await expect(voteContest(999, 5)).rejects.toThrow('Failed to vote')
    })
  })
})
