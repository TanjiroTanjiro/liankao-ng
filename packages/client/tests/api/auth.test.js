
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login, register, checkLogin } from '../../src/api/auth'
import request from '../../src/utils/request'

// Mock request module
vi.mock('../../src/utils/request')

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should call login API with correct parameters', async () => {
      const mockData = {
        nickname: 'testuser',
        unHashedPassword: 'password123'
      }
      const mockResponse = {
        success: true,
        data: {
          token: 'test-token',
          id: 1,
          nickname: 'testuser'
        }
      }
      request.mockResolvedValue(mockResponse)

      await login(mockData)

      expect(request).toHaveBeenCalledWith({
        url: '/auth/login',
        method: 'post',
        data: mockData
      })
    })

    it('should return response data on successful login', async () => {
      const mockData = {
        nickname: 'testuser',
        unHashedPassword: 'password123'
      }
      const mockResponse = {
        success: true,
        data: {
          token: 'test-token',
          id: 1,
          nickname: 'testuser'
        }
      }
      request.mockResolvedValue(mockResponse)

      const result = await login(mockData)

      expect(result).toEqual(mockResponse)
    })

    it('should handle login error', async () => {
      const mockData = {
        nickname: 'testuser',
        unHashedPassword: 'wrongpassword'
      }
      const mockError = new Error('Login failed')
      request.mockRejectedValue(mockError)

      await expect(login(mockData)).rejects.toThrow('Login failed')
    })
  })

  describe('register', () => {
    it('should call register API with correct parameters', async () => {
      const mockData = {
        xsyusername: 'testuser',
        nickname: 'Test User',
        unHashedPassword: 'password123',
        xsytoken: 'testtoken'
      }
      const mockResponse = {
        success: true,
        message: 'Registration successful',
        data: {
          token: 'test-token',
          id: 1,
          nickname: 'Test User'
        }
      }
      request.mockResolvedValue(mockResponse)

      await register(mockData)

      expect(request).toHaveBeenCalledWith({
        url: '/auth/register',
        method: 'post',
        data: mockData
      })
    })

    it('should return response data on successful registration', async () => {
      const mockData = {
        xsyusername: 'testuser',
        nickname: 'Test User',
        unHashedPassword: 'password123',
        xsytoken: 'testtoken'
      }
      const mockResponse = {
        success: true,
        message: 'Registration successful',
        data: {
          token: 'test-token',
          id: 1,
          nickname: 'Test User'
        }
      }
      request.mockResolvedValue(mockResponse)

      const result = await register(mockData)

      expect(result).toEqual(mockResponse)
    })

    it('should handle registration error', async () => {
      const mockData = {
        xsyusername: 'existinguser',
        nickname: 'Existing User',
        unHashedPassword: 'password123',
        xsytoken: 'testtoken'
      }
      const mockError = new Error('User already exists')
      request.mockRejectedValue(mockError)

      await expect(register(mockData)).rejects.toThrow('User already exists')
    })
  })

  describe('checkLogin', () => {
    it('should call checkLogin API', async () => {
      const mockResponse = {
        success: true,
        data: {
          token: 'test-token',
          id: 1,
          nickname: 'testuser'
        }
      }
      request.mockResolvedValue(mockResponse)

      await checkLogin()

      expect(request).toHaveBeenCalledWith({
        url: '/service/loginCheck',
        method: 'post'
      })
    })

    it('should return response data on successful check', async () => {
      const mockResponse = {
        success: true,
        data: {
          token: 'test-token',
          id: 1,
          nickname: 'testuser'
        }
      }
      request.mockResolvedValue(mockResponse)

      const result = await checkLogin()

      expect(result).toEqual(mockResponse)
    })

    it('should handle checkLogin error', async () => {
      const mockError = new Error('Not logged in')
      request.mockRejectedValue(mockError)

      await expect(checkLogin()).rejects.toThrow('Not logged in')
    })
  })
})
