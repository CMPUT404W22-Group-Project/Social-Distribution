/*
  Warnings:

  - The primary key for the `Nodes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Nodes" DROP CONSTRAINT "Nodes_pkey",
ADD CONSTRAINT "Nodes_pkey" PRIMARY KEY ("type", "url");
