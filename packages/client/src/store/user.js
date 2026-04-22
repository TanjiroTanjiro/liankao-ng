
import { defineStore } from 'pinia'
import { login, register, checkLogin } from '../api/auth'

const USER_INFO_STORAGE_KEY = 'userInfo'

const hasValidNickname = (userInfo) => {
  return !!(userInfo && typeof userInfo.nickname === 'string' && userInfo.nickname.trim())
}

const clearAllCookies = () => {
  if (typeof document === 'undefined') return
  document.cookie.split(';').forEach((cookie) => {
    const cookieName = cookie.split('=')[0]?.trim()
    if (!cookieName) return
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  })
}

const readStoredUserInfo = () => {
  try {
    const raw = localStorage.getItem(USER_INFO_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return hasValidNickname(parsed) ? parsed : null
  } catch (error) {
    return null
  }
}

const persistUserInfo = (userInfo) => {
  if (!hasValidNickname(userInfo)) return false
  localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(userInfo))
  return true
}

export const useUserStore = defineStore('user', {
  state: () => {
    const token = localStorage.getItem('token') || ''
    const storedUserInfo = readStoredUserInfo()
    if (token && !storedUserInfo) {
      clearAllCookies()
      localStorage.removeItem('token')
      localStorage.removeItem(USER_INFO_STORAGE_KEY)
    }
    return {
      token: storedUserInfo ? token : '',
      userInfo: storedUserInfo,
      isLoggedIn: !!token && !!storedUserInfo
    }
  },
  actions: {
    clearAuthState(clearCookies = false) {
      this.token = ''
      this.userInfo = null
      this.isLoggedIn = false
      localStorage.removeItem('token')
      localStorage.removeItem(USER_INFO_STORAGE_KEY)
      if (clearCookies) clearAllCookies()
    },
    setAuthState(token, userInfo) {
      if (!token || !persistUserInfo(userInfo)) {
        this.clearAuthState(true)
        return false
      }
      this.token = token
      this.userInfo = userInfo
      this.isLoggedIn = true
      localStorage.setItem('token', token)
      return true
    },
    async loginAction(data) {
      try {
        const res = await login(data)
        if (res.success && res.data?.token) {
          this.setAuthState(res.data.token, res.data)
        }
        return res
      } catch (error) {
        throw error
      }
    },
    async registerAction(data) {
      try {
        const res = await register(data)
        if (res.success && res.data?.token) {
          this.setAuthState(res.data.token, res.data)
        }
        return res
      } catch (error) {
        throw error
      }
    },
    async checkLoginAction() {
      try {
        const res = await checkLogin()
        if (res.success && res.data) {
          const ok = this.setAuthState(this.token || localStorage.getItem('token') || '', res.data)
          if (!ok) this.clearAuthState(true)
        }
        return res
      } catch (error) {
        this.clearAuthState(false)
        throw error
      }
    },
    logout() {
      this.clearAuthState(true)
    }
  }
})
