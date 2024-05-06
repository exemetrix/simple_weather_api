-- CreateTable
CREATE TABLE "LocationForecast" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "minCelsius" DECIMAL(4,2) NOT NULL,
    "maxCelsius" DECIMAL(4,2) NOT NULL,

    CONSTRAINT "LocationForecast_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocationForecast_locationId_date_key" ON "LocationForecast"("locationId", "date");

-- AddForeignKey
ALTER TABLE "LocationForecast" ADD CONSTRAINT "LocationForecast_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
