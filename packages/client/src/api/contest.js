
import request from '../utils/request'

export const getContestList = (params) => {
  return request({
    url: '/contest/list',
    method: 'get',
    params
  })
}

export const getContestDetail = (id) => {
  return request({
    url: `/contest/${id}`,
    method: 'get'
  })
}

export const getContestProblems = (id) => {
  return request({
    url: `/contest/${id}/problems`,
    method: 'get'
  })
}

export const voteContest = (id, score) => {
  return request({
    url: `/vote/contest/${id}`,
    method: 'post',
    data: { x: score }
  })
}
