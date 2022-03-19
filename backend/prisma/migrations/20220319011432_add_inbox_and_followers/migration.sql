-- CreateTable
CREATE TABLE "Inbox" (
    "type" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inbox_pkey" PRIMARY KEY ("typeId","authorId")
);

-- CreateTable
CREATE TABLE "Followers" (
    "authorId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "Followers_pkey" PRIMARY KEY ("authorId","followingId")
);

-- CreateTable
CREATE TABLE "FollowRequest" (
    "authorId" TEXT NOT NULL,
    "followReqId" TEXT NOT NULL,

    CONSTRAINT "FollowRequest_pkey" PRIMARY KEY ("authorId","followReqId")
);

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followers" ADD CONSTRAINT "Followers_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
