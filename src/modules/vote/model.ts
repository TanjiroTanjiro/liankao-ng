import { t } from 'elysia'

export const voteParams = t.Object({
  id: t.Number({ minimum: 1 }),
})

export const voteBody = t.Object({
  x: t.Number({ minimum: 0, maximum: 5 }),
})

export const voteSuccessResponse = t.Object({
  success: t.Literal(true),
})

export const voteApiError = t.Object({
  success: t.Literal(false),
  message: t.String(),
})

export type VoteBody = typeof voteBody.static
