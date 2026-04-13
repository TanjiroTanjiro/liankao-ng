
import request from '../utils/request'

export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export const register = (data) => {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

export const checkLogin = () => {
  return request({
    url: '/service/loginCheck',
    method: 'post'
  })
}
