/*
  Warnings:

  - Added the required column `video_id` to the `VideoAccess` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "VideoAccess" DROP CONSTRAINT "VideoAccess_video_title_fkey";

-- DropIndex
DROP INDEX "Videos_video_title_key";

-- AlterTable
ALTER TABLE "VideoAccess" ADD COLUMN     "video_id" INTEGER NOT NULL,
ALTER COLUMN "access_status" SET DEFAULT -1;

-- AddForeignKey
ALTER TABLE "VideoAccess" ADD CONSTRAINT "VideoAccess_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
