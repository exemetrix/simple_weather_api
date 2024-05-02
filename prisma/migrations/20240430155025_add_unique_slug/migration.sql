-- CreateTable
CREATE TABLE "location" (
    "id" SERIAL NOT NULL,
    "latitude" DECIMAL(4,2) NOT NULL,
    "longitude" DECIMAL(5,2) NOT NULL,
    "name" VARCHAR(220) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "location_slug_key" ON "location"("slug");
