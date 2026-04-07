import { t,Elysia } from 'elysia'
import { authGuard } from '../../plugins/auth-guard'
import {
  ContestListQuery,
  contestApiError,
  contestDetailParams,
  contestDetailResponse,
  contestListQuery,
  contestPaginatedResponse,
} from './model'
import { ContestService } from './service'

export const contest = new Elysia({
  prefix: '/contest',
  detail: {
    security: [{ bearerAuth: [] }],
    tags: ['contest'],
    description: '需 Bearer JWT（Authorization: Bearer <token>）。',
  },
})
  .use(authGuard)
  .model({
    listQuery: contestListQuery,
    paginatedResponse: contestPaginatedResponse,
    detailParams: contestDetailParams,
    detailResponse: contestDetailResponse,
    apiError: contestApiError,
  })
  .prefix('model', 'contest')
  .get('/list', ({ query } : { query: ContestListQuery }) => ContestService.list(query), {
    query: contestListQuery,
    response: { 200: contestPaginatedResponse },
    detail: {
      summary: '比赛列表（分页）',
      description:
        'page / pageSize 由服务端截断在合法范围内；可选 order: qualities-desc | qualities-asc | desc | asc，asc 和 desc 都是按开始时间排序，默认按开始时间降序（desc）。',
    },
  })
  .get('/:id', ({ params }) => ContestService.getById(params.id), {
    params: contestDetailParams,
    response: {
      200: contestDetailResponse,
      404: contestApiError,
    },
    detail: {
      summary: '比赛详情',
    },
  })
