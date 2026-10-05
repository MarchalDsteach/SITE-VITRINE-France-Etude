-- AlterTable
ALTER TABLE "Offer" ADD COLUMN "applicationClicks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lastClickedAt" TIMESTAMP(3);
