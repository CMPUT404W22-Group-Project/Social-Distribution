/*
  Warnings:

  - The primary key for the `Inbox` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorId` on the `Inbox` table. All the data in the column will be lost.
  - You are about to drop the column `likedId` on the `Inbox` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `Inbox` table. All the data in the column will be lost.
  - Added the required column `owner` to the `Inbox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `src` to the `Inbox` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inbox" DROP CONSTRAINT "Inbox_authorId_fkey";

-- AlterTable
ALTER TABLE "Inbox" DROP CONSTRAINT "Inbox_pkey",
DROP COLUMN "authorId",
DROP COLUMN "likedId",
DROP COLUMN "typeId",
ADD COLUMN     "likedAuthor" TEXT,
ADD COLUMN     "owner" TEXT NOT NULL,
ADD COLUMN     "src" TEXT NOT NULL,
ALTER COLUMN "dateTime" DROP NOT NULL,
ADD CONSTRAINT "Inbox_pkey" PRIMARY KEY ("src", "owner");

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_owner_fkey" FOREIGN KEY ("owner") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
