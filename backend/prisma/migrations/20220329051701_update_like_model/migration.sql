/*
  Warnings:

  - Added the required column `context` to the `Likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Likes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Likes" ADD COLUMN     "context" TEXT NOT NULL,
ADD COLUMN     "node" TEXT,
ADD COLUMN     "summary" TEXT NOT NULL;
