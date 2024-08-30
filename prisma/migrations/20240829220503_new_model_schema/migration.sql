-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'PARTICIPANT');

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(36) NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participants" (
    "id" VARCHAR(36) NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Participants_phoneNumber_key" ON "Participants"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Participants_email_key" ON "Participants"("email");
