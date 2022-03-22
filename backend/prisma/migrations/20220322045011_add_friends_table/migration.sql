/*
  Warnings:

  - You are about to drop the `FollowRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Followers" DROP CONSTRAINT "Followers_authorId_fkey";

-- DropTable
DROP TABLE "FollowRequest";

-- CreateTable
CREATE TABLE "Friends" (
    "authorId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("authorId","friendId")
);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "authorId" TEXT NOT NULL,
    "friendReqId" TEXT NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("authorId","friendReqId")
);

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_friendReqId_fkey" FOREIGN KEY ("friendReqId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
