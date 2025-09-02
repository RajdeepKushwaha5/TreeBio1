-- CreateTable
CREATE TABLE "Theme" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "config" JSONB NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "CustomDomain" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "domain" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT false,
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "verificationMethod" TEXT NOT NULL DEFAULT 'DNS',
  "verificationToken" TEXT NOT NULL,
  "sslValid" BOOLEAN NOT NULL DEFAULT false,
  "lastHealthCheck" TIMESTAMP(3),
  "isAccessible" BOOLEAN NOT NULL DEFAULT false,
  "responseTime" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CustomDomain_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "ShortUrl" (
  "id" TEXT NOT NULL,
  "shortCode" TEXT NOT NULL,
  "originalUrl" VARCHAR(2000) NOT NULL,
  "linkId" TEXT,
  "userId" TEXT,
  "clicks" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ShortUrl_pkey" PRIMARY KEY ("id")
);
-- AlterTable
ALTER TABLE "User"
ADD COLUMN "themeId" TEXT DEFAULT 'default';
ALTER TABLE "User"
ADD COLUMN "customTheme" JSONB;
ALTER TABLE "User"
ADD COLUMN "customDomain" TEXT;
-- AlterTable
ALTER TABLE "Link"
ADD COLUMN "shortUrl" TEXT;
ALTER TABLE "Link"
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Link"
ADD COLUMN "startDate" TIMESTAMP(3);
ALTER TABLE "Link"
ADD COLUMN "endDate" TIMESTAMP(3);
-- AlterTable
ALTER TABLE "LinkAnalytics"
ADD COLUMN "userAgent" VARCHAR(500);
ALTER TABLE "LinkAnalytics"
ADD COLUMN "referrer" VARCHAR(500);
ALTER TABLE "LinkAnalytics"
ADD COLUMN "country" VARCHAR(100);
ALTER TABLE "LinkAnalytics"
ADD COLUMN "city" VARCHAR(100);
ALTER TABLE "LinkAnalytics"
ADD COLUMN "device" VARCHAR(100);
ALTER TABLE "LinkAnalytics"
ADD COLUMN "browser" VARCHAR(100);
-- CreateIndex
CREATE UNIQUE INDEX "Theme_name_key" ON "Theme"("name");
-- CreateIndex
CREATE UNIQUE INDEX "CustomDomain_domain_key" ON "CustomDomain"("domain");
-- CreateIndex
CREATE INDEX "CustomDomain_userId_idx" ON "CustomDomain"("userId");
-- CreateIndex
CREATE INDEX "CustomDomain_domain_idx" ON "CustomDomain"("domain");
-- CreateIndex
CREATE UNIQUE INDEX "ShortUrl_shortCode_key" ON "ShortUrl"("shortCode");
-- CreateIndex
CREATE INDEX "ShortUrl_shortCode_idx" ON "ShortUrl"("shortCode");
-- CreateIndex
CREATE INDEX "ShortUrl_userId_idx" ON "ShortUrl"("userId");
-- CreateIndex
CREATE UNIQUE INDEX "User_customDomain_key" ON "User"("customDomain");
-- CreateIndex
CREATE UNIQUE INDEX "Link_shortUrl_key" ON "Link"("shortUrl");
-- AddForeignKey
ALTER TABLE "CustomDomain"
ADD CONSTRAINT "CustomDomain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;