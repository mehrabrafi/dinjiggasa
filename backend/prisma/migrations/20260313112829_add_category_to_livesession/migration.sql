/*
  Warnings:

  - You are about to drop the column `type` on the `LiveSession` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `LiveSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LiveSession" DROP COLUMN "type",
DROP COLUMN "videoUrl",
ADD COLUMN     "category" TEXT;
