/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Added the required column `id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `realname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xsyusername` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Problem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Contest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContestProblem" (
    "contestId" INTEGER NOT NULL,
    "problemId" INTEGER NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("contestId", "problemId"),
    CONSTRAINT "ContestProblem_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContestProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Participation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "contestId" INTEGER NOT NULL,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL,
    "postContestRating" INTEGER NOT NULL,
    "scores" JSONB NOT NULL,
    CONSTRAINT "Participation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Participation_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "xsytoken" TEXT,
    "xsyusername" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "realname" TEXT NOT NULL,
    "password" TEXT,
    "rating" INTEGER NOT NULL
);
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_xsyusername_key" ON "User"("xsyusername");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ContestProblem_contestId_idx" ON "ContestProblem"("contestId");

-- CreateIndex
CREATE INDEX "ContestProblem_problemId_idx" ON "ContestProblem"("problemId");

-- CreateIndex
CREATE INDEX "Participation_contestId_idx" ON "Participation"("contestId");

-- CreateIndex
CREATE INDEX "Participation_userId_idx" ON "Participation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Participation_userId_contestId_key" ON "Participation"("userId", "contestId");
