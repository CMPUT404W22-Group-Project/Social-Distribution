-- CreateTable
CREATE TABLE "Nodes" (
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Nodes_pkey" PRIMARY KEY ("url")
);
