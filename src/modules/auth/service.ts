// src/modules/auth/service.ts
import { loginCheck } from '../../user/loginCheck'
import { registerRealUser } from '../../user/registerUser'
import { UserPayload } from '../../types/user'

export class AuthService {
  async register(xsytoken: string, nickname: string, unHashedPassword: string) {
    // throws on failure
    return registerRealUser(unHashedPassword, nickname, xsytoken)
  }

  async login(nickname: string, unHashedPassword: string) {
    // throws on failure
    return loginCheck(nickname, unHashedPassword)
  }
}