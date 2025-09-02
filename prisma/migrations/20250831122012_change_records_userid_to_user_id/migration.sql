/*
  Warnings:

  - You are about to drop the column `userid` on the `Records` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Records` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Records" DROP CONSTRAINT "Records_userid_fkey";

-- DropIndex
DROP INDEX "public"."Records_userid_idx";

-- AlterTable
ALTER TABLE "public"."Records" DROP COLUMN "userid",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Records_userId_idx" ON "public"."Records"("userId");

-- AddForeignKey
ALTER TABLE "public"."Records" ADD CONSTRAINT "Records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("clerkUserid") ON DELETE CASCADE ON UPDATE CASCADE;
