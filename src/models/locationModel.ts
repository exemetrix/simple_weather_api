import { PrismaClient } from '@prisma/client';
import type { Location } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import axios from 'axios';
// import { Decimal } from '@prisma/client/runtime/library';

function locationModel() {
  const prisma = new PrismaClient();
  // 7 Timer Weather API axios connection
  const sevenTimerAPI = axios.create({
    baseURL: 'https://www.7timer.info/bin/astro.php',
    timeout: 3000
  });

  async function createLocation(
    latitude: number,
    longitude: number,
    slug: string
  ) {
    try {
      const createdLocation = await prisma.location.create({
        data: {
          latitude,
          longitude,
          slug
        }
      });

      // Fetch weather forecast for the newly created location
      await updateForecast(
        createdLocation.id,
        createdLocation.latitude,
        createdLocation.longitude
      );

      return createdLocation != null;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async function getLocation(slug: string): Promise<Location | undefined> {
    try {
      const locationData = await prisma.location.findUnique({
        where: { slug }
      });
      return locationData ? locationData : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async function getLocations(): Promise<Location[]> {
    try {
      const locationsData = await prisma.location.findMany();
      return locationsData;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async function getForecast(slug: string, minDate: string, maxDate: string) {
    const locationData = await prisma.location.findUnique({
      where: { slug },
      select: {
        name: true,
        locationForecast: {
          where: {
            date: {
              gte: new Date(minDate).toISOString(),
              lte: new Date(maxDate).toISOString()
            }
          }
        }
      }
    });

    if (!locationData) {
      return {
        data: null,
        message: 'Location not found'
      };
    }

    if (locationData.locationForecast.length === 0) {
      return {
        data: null,
        message: `Forecast data not available for ${minDate} - ${maxDate} interval`
      };
    }

    return {
      data: locationData.locationForecast.map((d) => ({
        date: d.date.toISOString().split('T')[0],
        'min-forecasted': d.minCelsius.toNumber(),
        'max-forecasted': d.maxCelsius.toNumber()
      })),
      message: `Forecast data successfully retrieved for ${minDate} - ${maxDate} interval`
    };
  }

  async function updateLocation(
    latitude: number,
    longitude: number,
    name: string,
    slug: string
  ): Promise<boolean> {
    try {
      const updatedLocation = await prisma.location.update({
        where: { slug },
        data: {
          latitude,
          longitude,
          name
        }
      });
      return updatedLocation != null;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async function updateForecasts() {
    const locationsData = await prisma.location.findMany({
      select: {
        id: true,
        latitude: true,
        longitude: true
      }
    });

    // Locations not available
    if (!locationsData || locationsData.length === 0) {
      return false;
    }

    // Loop stored locations
    for (let i = 0; i < locationsData.length; i++) {
      // Cal update forecast function here
      await updateForecast(
        locationsData[i].id,
        locationsData[i].latitude,
        locationsData[i].longitude
      );
    }

    return true;
  }

  async function updateForecast(
    locationId: number,
    locationLatitude: Decimal,
    locationLongitude: Decimal
  ) {
    const fetchDate = new Date();
    fetchDate.setUTCHours(0, 0, 0, 0); // Since we only need date comparison, set time to 0

    let forecastData;
    try {
      // Fetch forecast data from 7 Timer API
      forecastData = (
        await sevenTimerAPI.get('', {
          params: {
            lon: locationLatitude,
            lat: locationLongitude,
            ac: 0,
            unit: 'metric',
            output: 'json',
            tz_shift: 0
          },
          validateStatus: (status) => status < 500 // Prevent errors on HTTP error codes lower than 500
        })
      ).data.dataseries;
    } catch (e) {
      console.error(e);
      return false;
    }

    // Weather forecast is given in 3 hour intervals
    const chunkSize = forecastData.length / 3;
    let chunkDay = 0;

    // Loop content in chunks size
    for (let j = 0; j < forecastData.length; j += chunkSize) {
      const chunk = forecastData.slice(j, j + chunkSize);

      const chunkTimestamp = new Date(fetchDate);
      chunkTimestamp.setUTCDate(chunkTimestamp.getUTCDate() + chunkDay);

      const chunkMinCelsius = Math.min(...chunk.map(({ temp2m }) => temp2m));
      const chunkMaxCelsius = Math.max(...chunk.map(({ temp2m }) => temp2m));

      // Search for forecast record on the current day
      const targetRecord = await prisma.locationForecast.findFirst({
        where: {
          locationId,
          date: chunkTimestamp.toISOString()
        }
      });

      // Update forecast record if we already have an entry for the current date
      if (targetRecord) {
        await prisma.locationForecast.updateMany({
          where: {
            locationId,
            date: chunkTimestamp.toISOString()
          },
          data: {
            minCelsius: chunkMinCelsius,
            maxCelsius: chunkMaxCelsius
          }
        });

        // Create a new forecast record since we don't have one for the current day on the DB
      } else {
        await prisma.locationForecast.create({
          data: {
            locationId,
            date: chunkTimestamp.toISOString(),
            minCelsius: chunkMinCelsius,
            maxCelsius: chunkMaxCelsius
          }
        });
      }

      chunkDay++;
    }

    return true;
  }

  async function deleteLocation(slug: string): Promise<boolean> {
    try {
      const deletedLocation = await prisma.location.delete({
        where: { slug }
      });
      return deletedLocation != null;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  return {
    createLocation,
    updateLocation,
    deleteLocation,
    getLocation,
    getLocations,
    getForecast,
    updateForecasts
  };
}

export default locationModel;
