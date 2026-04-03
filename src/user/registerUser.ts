// src/user/registerUser.ts
import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { getUserRealname } from "../scraper/getUserRealname";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:../../data.db",
});

const prisma = new PrismaClient({ adapter });

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
  xsyusername: string,
  unHashedPassword: string,
  nickname: string,
  xsytoken: string
) {
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