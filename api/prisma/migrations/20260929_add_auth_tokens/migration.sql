ALTER TABLE "User"
  ADD COLUMN "emailVerificationTokenHash" TEXT,
  ADD COLUMN "emailVerificationExpiresAt" TIMESTAMP(3),
  ADD COLUMN "passwordResetTokenHash" TEXT,
  ADD COLUMN "passwordResetExpiresAt" TIMESTAMP(3);

UPDATE "User" SET "emailVerified" = true WHERE "emailVerificationTokenHash" IS NULL;

CREATE INDEX "User_emailVerificationTokenHash_idx" ON "User"("emailVerificationTokenHash");
CREATE INDEX "User_passwordResetTokenHash_idx" ON "User"("passwordResetTokenHash");