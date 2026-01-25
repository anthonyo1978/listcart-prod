-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('DRAFT', 'SENT', 'VENDOR_APPROVED', 'INVOICE_SENT', 'PAID', 'APPROVED');

-- CreateEnum
CREATE TYPE "PaymentChoice" AS ENUM ('PAY_NOW', 'PAY_LATER');

-- CreateEnum
CREATE TYPE "SupplierType" AS ENUM ('PHOTOGRAPHER', 'COPYWRITER', 'SIGNBOARD', 'DIGITAL', 'STYLIST');

-- CreateEnum
CREATE TYPE "OutboundEmailType" AS ENUM ('AGENT_SUMMARY', 'SUPPLIER_WORK_ORDER');

-- CreateEnum
CREATE TYPE "VendorCommunicationMode" AS ENUM ('FIRST_COME_FIRST_SERVE', 'REVIEW_AND_APPROVE');

-- CreateEnum
CREATE TYPE "PaymentPreference" AS ENUM ('CARD', 'PAY_LATER', 'NOT_SURE');

-- CreateEnum
CREATE TYPE "CartItemStatus" AS ENUM ('PENDING', 'PROVIDER_ACCEPTED', 'AGENT_APPROVED');

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "friendlyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "CartStatus" NOT NULL DEFAULT 'DRAFT',
    "propertyAddress" TEXT NOT NULL,
    "vendorName" TEXT NOT NULL,
    "vendorEmail" TEXT,
    "vendorPhone" TEXT,
    "agentName" TEXT NOT NULL,
    "agentEmail" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "paymentChoice" "PaymentChoice",
    "totalCents" INTEGER NOT NULL DEFAULT 0,
    "vendorCommunicationMode" "VendorCommunicationMode",
    "paymentPreference" "PaymentPreference",

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "serviceKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "supplierType" "SupplierType" NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "agentNotes" TEXT,
    "vendorId" TEXT,
    "itemStatus" "CartItemStatus" NOT NULL DEFAULT 'PENDING',
    "providerResponse" TEXT,
    "providerQuoteCents" INTEGER,
    "providerAvailableDate" TEXT,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboundEmail" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "type" "OutboundEmailType" NOT NULL,
    "supplierType" "SupplierType",
    "toEmail" TEXT,
    "subject" TEXT NOT NULL,
    "bodyText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutboundEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "serviceKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "supplierType" "SupplierType" NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "defaultSelected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceVendor" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "serviceKey" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceVendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentSettings" (
    "id" TEXT NOT NULL,
    "agentEmail" TEXT NOT NULL,
    "globalCommissionPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "autoApplyCommission" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_friendlyId_key" ON "Cart"("friendlyId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_token_key" ON "Cart"("token");

-- CreateIndex
CREATE INDEX "Cart_token_idx" ON "Cart"("token");

-- CreateIndex
CREATE INDEX "Cart_friendlyId_idx" ON "Cart"("friendlyId");

-- CreateIndex
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");

-- CreateIndex
CREATE INDEX "CartItem_vendorId_idx" ON "CartItem"("vendorId");

-- CreateIndex
CREATE INDEX "OutboundEmail_cartId_idx" ON "OutboundEmail"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "Service_serviceKey_key" ON "Service"("serviceKey");

-- CreateIndex
CREATE INDEX "Service_displayOrder_idx" ON "Service"("displayOrder");

-- CreateIndex
CREATE INDEX "Service_serviceKey_idx" ON "Service"("serviceKey");

-- CreateIndex
CREATE INDEX "ServiceVendor_serviceKey_idx" ON "ServiceVendor"("serviceKey");

-- CreateIndex
CREATE INDEX "ServiceVendor_vendorId_idx" ON "ServiceVendor"("vendorId");

-- CreateIndex
CREATE INDEX "ServiceVendor_displayOrder_idx" ON "ServiceVendor"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceVendor_vendorId_serviceKey_key" ON "ServiceVendor"("vendorId", "serviceKey");

-- CreateIndex
CREATE UNIQUE INDEX "AgentSettings_agentEmail_key" ON "AgentSettings"("agentEmail");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutboundEmail" ADD CONSTRAINT "OutboundEmail_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceVendor" ADD CONSTRAINT "ServiceVendor_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

