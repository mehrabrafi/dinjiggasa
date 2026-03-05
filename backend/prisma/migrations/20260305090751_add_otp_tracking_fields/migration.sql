-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastOtpSentAt" TIMESTAMP(3),
ADD COLUMN     "otpAttempts" INTEGER NOT NULL DEFAULT 0;
