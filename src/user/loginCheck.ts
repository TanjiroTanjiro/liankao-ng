import { prisma } from "../prisma";
import type { UserPayload } from "../types/user";

export async function loginCheck(xsyusername : string,unHashedPassword : string)  : Promise<UserPayload>{
    const userData = await prisma.user.findUnique({ where: { xsyusername } });
    if(!userData || !userData.password)  throw new Error("User DNE.");
    if(!await Bun.password.verify(unHashedPassword, userData.password)) throw new Error("Wrong Password.");
    return {
        xsyusername: userData.xsyusername,
        nickname: userData.nickname,
        rating: userData.rating,
        id: userData.id
    };
}