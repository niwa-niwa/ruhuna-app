-- DropIndex
DROP INDEX "User_id_firebaseId_username_idx";

-- AlterTable
ALTER TABLE "Village" ALTER COLUMN "description" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "User_id_firebaseId_idx" ON "User"("id", "firebaseId");
