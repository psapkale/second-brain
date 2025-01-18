/*
  Warnings:

  - Added the required column `isPublid` to the `Container` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imgUrl` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Container" ADD COLUMN     "isPublid" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imgUrl" TEXT NOT NULL;
