/*
  Warnings:

  - You are about to drop the column `receiver` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `receiver` on the `Likes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "receiver";

-- AlterTable
ALTER TABLE "Likes" DROP COLUMN "receiver";
