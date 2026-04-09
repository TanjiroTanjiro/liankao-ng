// src/modules/auth/model.ts
import { t } from 'elysia'

export const RegisterBody = t.Object({
  xsytoken: t.String(),
  nickname: t.String(),
  unHashedPassword: t.String(),
})

export const LoginBody = t.Object({
  nickname: t.String(),
  unHashedPassword: t.String(),
})

export type RegisterBodyType = typeof RegisterBody.static
export type LoginBodyType = typeof LoginBody.static