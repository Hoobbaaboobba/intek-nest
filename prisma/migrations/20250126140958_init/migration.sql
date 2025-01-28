-- CreateTable
CREATE TABLE "VideoAccess" (
    "id" SERIAL NOT NULL,
    "fio_or_name" TEXT NOT NULL,
    "video_title" TEXT NOT NULL,
    "access_status" INTEGER NOT NULL,

    CONSTRAINT "VideoAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Videos" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "video_title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Videos_link_key" ON "Videos"("link");

-- CreateIndex
CREATE UNIQUE INDEX "Videos_video_title_key" ON "Videos"("video_title");

-- AddForeignKey
ALTER TABLE "VideoAccess" ADD CONSTRAINT "VideoAccess_video_title_fkey" FOREIGN KEY ("video_title") REFERENCES "Videos"("video_title") ON DELETE RESTRICT ON UPDATE CASCADE;
