import { Elysia } from 'elysia'
import {
  ratingApiError,
  ratingListResponse,
  ratingUserParams,
  ratingUserResponse,
} from './model'
import { RatingService } from './service'

export const rating = new Elysia({
  prefix: '/rating',
  detail: {
    tags: ['rating'],
  },
})
  .model({
    listResponse: ratingListResponse,
    userParams: ratingUserParams,
    userResponse: ratingUserResponse,
    apiError: ratingApiError,
  })
  .prefix('model', 'rating')
  .get('/list', () => RatingService.list(), {
    response: {
      200: ratingListResponse,
    },
    detail: {
      summary: '所有用户 rating 列表',
    },
  })
  .get('/:USER', ({ params }) => RatingService.getByNickname(params.USER), {
    params: ratingUserParams,
    response: {
      200: ratingUserResponse,
      404: ratingApiError,
    },
    detail: {
      summary: '按 nickname 查询 rating',
    },
  })
