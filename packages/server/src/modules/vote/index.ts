import { Elysia, status } from 'elysia'
import { authGuard } from '../../plugins/auth-guard'
import { voteApiError, voteBody, voteParams, voteSuccessResponse } from './model'
import { VoteService } from './service'

export const vote = new Elysia({
  prefix: '/vote',
  detail: {
    security: [{ bearerAuth: [] }],
    tags: ['vote'],
    description: '需 Bearer JWT（Authorization: Bearer <token>）。',
  },
})
  .use(authGuard)
  .model({
    voteParams,
    voteBody,
    voteSuccessResponse,
    apiError: voteApiError,
  })
  .post('/problem/:id', ({ params, body, user }) => {
    if (!user) return status(403, { success: false as const, message: 'Unauthorized' })
    return VoteService.voteProblem(user.id, params.id, body.x)
  }, {
    params: voteParams,
    body: voteBody,
    response: {
      200: voteSuccessResponse,
      403: voteApiError,
      404: voteApiError,
    },
    detail: {
      summary: '题目投票',
      description: '对题目投 [0,5] 整数分；同一用户后续投票会覆盖之前投票。',
    },
  })
  .post('/contest/:id', ({ params, body, user }) => {
    if (!user) return status(403, { success: false as const, message: 'Unauthorized' })
    return VoteService.voteContest(user.id, params.id, body.x)
  }, {
    params: voteParams,
    body: voteBody,
    response: {
      200: voteSuccessResponse,
      403: voteApiError,
      404: voteApiError,
    },
    detail: {
      summary: '比赛投票',
      description: '对比赛投 [0,5] 整数分；同一用户后续投票会覆盖之前投票。',
    },
  })
