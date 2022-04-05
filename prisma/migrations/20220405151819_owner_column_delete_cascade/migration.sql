-- DropForeignKey
ALTER TABLE "Village" DROP CONSTRAINT "Village_userId_fkey";

-- AddForeignKey
ALTER TABLE "Village" ADD CONSTRAINT "Village_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
