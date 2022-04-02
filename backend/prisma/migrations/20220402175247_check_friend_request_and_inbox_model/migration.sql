/*
  Warnings:

  - The primary key for the `FriendRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Inbox` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `likedAuthor` on the `Inbox` table. All the data in the column will be lost.
  - Added the required column `accept` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `Inbox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_pkey",
ADD COLUMN     "accept" BOOLEAN NOT NULL,
ADD COLUMN     "node" TEXT,
ADD CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("authorId", "friendReqId", "accept");

-- AlterTable
ALTER TABLE "Inbox" DROP CONSTRAINT "Inbox_pkey",
DROP COLUMN "likedAuthor",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "message" TEXT NOT NULL,
ADD CONSTRAINT "Inbox_pkey" PRIMARY KEY ("id");
