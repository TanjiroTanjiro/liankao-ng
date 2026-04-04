// src/user/registerUser.ts
import { prisma } from "../prisma";
import { getUserRealname, getUserXsyName } from "../scraper/getUserInfo";

export async function registerGhostUser(
  xsyusername: string,
  realname: string
) {
  const userData = await prisma.user.findUnique({
    where: { xsyusername },
  });

  if (userData) return userData;

  return prisma.user.create({
    data: {
      xsyusername,
      nickname: xsyusername,
      realname,
      rating: 0,
    },
  });
}

export async function registerRealUser(
  unHashedPassword: string,
  nickname: string,
  xsytoken: string
) {
  let xsyusername=await getUserXsyName(xsytoken);
  const [password, userData] = await Promise.all([
    Bun.password.hash(unHashedPassword),
    prisma.user.findUnique({ where: { xsyusername } }),
  ]);

  const realName = await getUserRealname(xsytoken);

  if (userData) {
    if (userData.password) {
      throw new Error("User Exists!");
    }

    return prisma.user.update({
      where: { xsyusername },
      data: {
        password,
        xsytoken,
        nickname,
        realname: realName,
      },
    });
  }

  return prisma.user.create({
    data: {
      xsyusername,
      nickname,
      password,
      xsytoken,
      realname: realName,
      rating: 0,
    },
  });
}