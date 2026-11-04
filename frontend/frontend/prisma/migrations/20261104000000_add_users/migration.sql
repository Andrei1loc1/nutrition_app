CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_displayName_key" ON "users"("displayName");

ALTER TABLE "Scan" ADD COLUMN "userId" TEXT;
ALTER TABLE "Meal" ADD COLUMN "userId" TEXT;
ALTER TABLE "ReportSnapshot" ADD COLUMN "userId" TEXT;

CREATE INDEX "Scan_userId_idx" ON "Scan"("userId");
CREATE INDEX "Meal_userId_idx" ON "Meal"("userId");
CREATE INDEX "ReportSnapshot_userId_idx" ON "ReportSnapshot"("userId");

ALTER TABLE "Scan" ADD CONSTRAINT "Scan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ReportSnapshot" ADD CONSTRAINT "ReportSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
