// src/modules/auth/service.ts
import { loginCheck } from '../../user/loginCheck'
import { registerRealUser } from '../../user/registerUser'
import { UserPayload } from '../../types/user'

export function hasInvalidUsernameChars(username: string): boolean {
  const invisibleRe = /[\p{C}\p{Z}]/u;
  const extraRe =/[?/.'"{}[\]\\|=+!~`@#$%\^&*();:,<>]/u;
  return invisibleRe.test(username) || extraRe.test(username);
}

function checkUsername(name : string){
  if(name.length<=3 || name.length>20) throw new Error("Illegal length of nickname!");
  if(hasInvalidUsernameChars(name))    throw new Error("Illegal char in nickname!");
}

export class AuthService {
  async register(xsytoken: string, nickname: string, unHashedPassword: string) {
    nickname=nickname.trim();
    checkUsername(nickname);
    return registerRealUser(unHashedPassword, nickname, xsytoken)
  }

  async login(nickname: string, unHashedPassword: string) {
    nickname=nickname.trim();
    checkUsername(nickname);
    return loginCheck(nickname, unHashedPassword)
  }
}