import { t } from 'elysia'

export const createContestBody = t.Object({
  package: t.Object({
    contestId: t.Number({ minimum: 1 }),
  }),
})

export const createContestSuccessResponse = t.Object({
  success: t.Literal(true),
  message: t.String(),
})

export const createContestErrorResponse = t.Object({
  success: t.Literal(false),
  message: t.String(),
})

export type CreateContestBody = typeof createContestBody.static
