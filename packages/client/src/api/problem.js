
import request from '../utils/request'

export const getProblemList = (params) => {
  return request({
    url: '/problem/list',
    method: 'get',
    params
  })
}

export const getProblemDetail = (id) => {
  return request({
    url: `/problem/${id}`,
    method: 'get'
  })
}

export const voteProblem = (id, score) => {
  return request({
    url: `/vote/problem/${id}`,
    method: 'post',
    data: { x: score }
  })
}
