/*
  Warnings:

  - Added the required column `receiver` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver` to the `Likes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "node" TEXT,
ADD COLUMN     "receiver" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Likes" ADD COLUMN     "receiver" TEXT NOT NULL;
