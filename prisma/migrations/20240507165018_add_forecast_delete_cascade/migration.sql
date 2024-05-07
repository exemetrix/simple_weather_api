-- DropForeignKey
ALTER TABLE "LocationForecast" DROP CONSTRAINT "LocationForecast_locationId_fkey";

-- AddForeignKey
ALTER TABLE "LocationForecast" ADD CONSTRAINT "LocationForecast_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
