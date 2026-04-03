-- AlterTable
ALTER TABLE "Contest" ADD COLUMN "qualities" INTEGER;
ALTER TABLE "Contest" ADD COLUMN "type" TEXT;

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN "difficulties" INTEGER;
ALTER TABLE "Problem" ADD COLUMN "qualities" INTEGER;

-- CreateTable
CREATE TABLE "Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "contestId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vote_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Vote_userId_idx" ON "Vote"("userId");

-- CreateIndex
CREATE INDEX "Vote_contestId_idx" ON "Vote"("contestId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_contestId_key" ON "Vote"("userId", "contestId");
