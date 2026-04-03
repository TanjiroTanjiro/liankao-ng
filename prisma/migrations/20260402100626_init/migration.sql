-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
