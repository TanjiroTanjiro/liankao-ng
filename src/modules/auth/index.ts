// src/modules/auth/index.ts
import { Elysia, status } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { AuthService } from './service'
import { RegisterBody,LoginBody } from './model'
import { UserPayload } from '../../types/user'

const JWT_SECRET = process.env.JWT_SECRET!

export const auth = new Elysia({ prefix: '/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
    })
  )
  .post(
    '/register',
    async ({ body, jwt, cookie: { token } }) => {
      const { xsytoken, nickname, unHashedPassword } = body
      const service = new AuthService()

      try {
        const userPayload=await service.register(xsytoken, nickname, unHashedPassword);
        const jwtToken = await jwt.sign(userPayload)

        // ✅ 正确设置 Cookie
        token.set({
          value: jwtToken,
          httpOnly: true,
          path: '/',
          maxAge: 7 * 24 * 60 * 60, // 7 days
        })

        return { success: true, message: 'Registration successful' }
      } catch (error: any) {
        return status(400, { error: error.message || 'UKE' })
      }
    },
    {
      body: RegisterBody,
    }
  )
  .post(
    '/login',
    async ({ body, jwt, cookie: { token } }) => {
      const { nickname, unHashedPassword } = body
      const service = new AuthService()

      try {
        const userPayload = await service.login(nickname, unHashedPassword)
        const jwtToken = await jwt.sign(userPayload)

        token.set({
          value: jwtToken,
          httpOnly: true,
          path: '/',
          maxAge: 7 * 24 * 60 * 60, // 7 days
        })

        return { success: true, message: 'Login successful' }
      } catch (error: any) {
        return status(401, { error: error.message || 'UKE' })
      }
    },
    {
      body: LoginBody,
    }
  )