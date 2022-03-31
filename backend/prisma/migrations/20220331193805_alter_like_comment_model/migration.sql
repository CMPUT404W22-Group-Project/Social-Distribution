/*
  Warnings:

  - The primary key for the `Likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `postId` on the `Likes` table. All the data in the column will be lost.
  - Added the required column `context` to the `Likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `object` to the `Likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Likes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_postId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "node" TEXT;

-- AlterTable
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_pkey",
DROP COLUMN "postId",
ADD COLUMN     "context" TEXT NOT NULL,
ADD COLUMN     "node" TEXT,
ADD COLUMN     "object" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT NOT NULL,
ADD CONSTRAINT "Likes_pkey" PRIMARY KEY ("object", "authorId");
