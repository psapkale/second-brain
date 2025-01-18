/*
  Warnings:

  - You are about to drop the column `isPublid` on the `Container` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Container" DROP COLUMN "isPublid",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;
