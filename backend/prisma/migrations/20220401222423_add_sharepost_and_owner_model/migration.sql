-- CreateTable
CREATE TABLE "SharedPost" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "content" TEXT,
    "categories" TEXT[],
    "published" TIMESTAMP(3) NOT NULL,
    "visibility" TEXT NOT NULL,
    "unlisted" BOOLEAN NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "receiver" TEXT NOT NULL,
    "node" TEXT,

    CONSTRAINT "SharedPost_pkey" PRIMARY KEY ("id","receiver")
);

-- CreateTable
CREATE TABLE "PostOwner" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "github" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "node" TEXT,

    CONSTRAINT "PostOwner_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SharedPost" ADD CONSTRAINT "SharedPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "PostOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
