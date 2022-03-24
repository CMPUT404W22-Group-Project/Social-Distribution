/*
  Warnings:

  - Added the required column `admin` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "admin" BOOLEAN NOT NULL;
