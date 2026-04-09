import { t } from 'elysia'

export const ratingListItem = t.Object({
  nickname: t.String(),
  rating: t.Number(),
})

export const ratingListResponse = t.Object({
  success: t.Literal(true),
  data: t.Array(ratingListItem),
})

export const ratingUserParams = t.Object({
  USER: t.String(),
})

export const ratingUserResponse = t.Object({
  success: t.Literal(true),
  data: ratingListItem,
})

export const ratingApiError = t.Object({
  success: t.Literal(false),
  message: t.String(),
})
