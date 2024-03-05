-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conditions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "diagnostic_metrics" TEXT,

    CONSTRAINT "Conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticGroups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "diagnostics" TEXT,
    "diagnostic_metrics" TEXT,

    CONSTRAINT "DiagnosticGroups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticMetrics" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "oru_sonic_codes" TEXT,
    "diagnostic" TEXT,
    "diagnostic_groups" TEXT,
    "oru_sonic_units" TEXT,
    "units" TEXT,
    "min_age" INTEGER DEFAULT 0,
    "max_age" INTEGER DEFAULT 200,
    "gender" TEXT NOT NULL DEFAULT 'Any',
    "standard_lower" DOUBLE PRECISION,
    "standard_higher" DOUBLE PRECISION,
    "everlab_lower" DOUBLE PRECISION,
    "everlab_higher" DOUBLE PRECISION,

    CONSTRAINT "DiagnosticMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnostic" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "diagnostic_groups" TEXT,
    "diagnostic_metrics" TEXT,

    CONSTRAINT "Diagnostic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Files" (
    "key" TEXT NOT NULL,
    "label" TEXT,
    "original" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
