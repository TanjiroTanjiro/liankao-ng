import { Elysia, status } from 'elysia'
import { authGuard } from '../../plugins/auth-guard'
import {
  createContestBody,
  createContestErrorResponse,
  createContestSuccessResponse,
} from './model'
import { CreateService } from './service'

export const create = new Elysia({
  prefix: '/create',
  detail: {
    security: [{ bearerAuth: [] }],
    tags: ['create'],
    description: '需 Bearer JWT（Authorization: Bearer <token>）。',
  },
})
  .use(authGuard)
  .post('/contest', ({ body, user }) => {
    if (!user) {
      return status(403, { success: false as const, message: 'Unauthorized' })
    }
    return CreateService.createContest(user.id, body.package.contestId)
  }, {
    body: createContestBody,
    response: {
      200: createContestSuccessResponse,
      400: createContestErrorResponse,
      403: createContestErrorResponse,
      500: createContestErrorResponse,
    },
    detail: {
      summary: '创建比赛并重算 rating',
      description: '仅管理员可调用（由 ADMIN_NICKNAMES 控制）。传入 package.contestId，使用当前用户 xsytoken 抓取比赛、题目、榜单并自动重算 rating；若未爬到题目则不会创建比赛。',
    },
  })
