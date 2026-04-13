
import { defineStore } from 'pinia'
import { login, register, checkLogin } from '../api/auth'

export const useUserStore = defineStore('user', {
  state: () => {
    const token = localStorage.getItem('token') || ''
    return {
      token,
      userInfo: null,
      isLoggedIn: !!token
    }
  },
  actions: {
    async loginAction(data) {
      try {
        const res = await login(data)
        console.log('Login response:', res)
        if (res.success && res.data?.token) {
          this.token = res.data.token
          this.userInfo = res.data
          this.isLoggedIn = true
          localStorage.setItem('token', res.data.token)
          console.log('Login successful, isLoggedIn:', this.isLoggedIn)
        } else {
          console.log('Login failed, res.success:', res.success, 'res.data:', res.data)
        }
        return res
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    async registerAction(data) {
      try {
        const res = await register(data)
        if (res.success && res.data?.token) {
          this.token = res.data.token
          this.userInfo = res.data
          this.isLoggedIn = true
          localStorage.setItem('token', res.data.token)
        }
        return res
      } catch (error) {
        throw error
      }
    },
    async checkLoginAction() {
      try {
        const res = await checkLogin()
        if (res.success) {
          this.isLoggedIn = true
          this.userInfo = res.data
        }
        return res
      } catch (error) {
        this.isLoggedIn = false
        throw error
      }
    },
    logout() {
      this.token = ''
      this.userInfo = null
      this.isLoggedIn = false
      localStorage.removeItem('token')
    }
  }
})
