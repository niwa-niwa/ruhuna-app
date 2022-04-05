/*
  Warnings:

  - Added the required column `userId` to the `Village` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Village_id_idx";

-- AlterTable
ALTER TABLE "Village" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Village_id_userId_idx" ON "Village"("id", "userId");

-- AddForeignKey
ALTER TABLE "Village" ADD CONSTRAINT "Village_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
