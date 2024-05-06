import { PrismaClient } from '@prisma/client';
import type { Location } from '@prisma/client';
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

  async function getForecast(slug: string) {
    const locationData = await prisma.location.findUnique({
      where: { slug },
      select: {
        latitude: true,
        longitude: true
      }
    });

    // Location not found error
    if (!locationData) {
      return {
        data: null,
        message: 'Location absent from DB'
      };
    }

    const fetchDate = new Date();
    fetchDate.setUTCHours(0, 0, 0, 0); // Since we only need date comparison, set time to 0

    let forecastData;
    try {
      // Fetch forecast data from 7 Timer API
      forecastData = (
        await sevenTimerAPI.get('', {
          params: {
            lon: locationData.longitude,
            lat: locationData.latitude,
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
      return {
        data: null,
        message: 'Error fetching data from 7 Timer API'
      };
    }

    // Weather forecast is given in 3 hour intervals
    const chunkSize = forecastData.length / 3;
    let chunkDay = 0;
    const forecastResult: {
      date: string;
      'min-forecasted': number;
      'max-forecasted': number;
    }[] = [];
    // Loop content in chunks size
    for (let i = 0; i < forecastData.length; i += chunkSize) {
      const chunk = forecastData.slice(i, i + chunkSize);
      const chunkDate = new Date(fetchDate);
      chunkDate.setUTCDate(chunkDate.getUTCDate() + chunkDay);

      forecastResult.push({
        date: chunkDate.toISOString().split('T')[0],
        'min-forecasted': Math.min(...chunk.map(({ temp2m }) => temp2m)),
        'max-forecasted': Math.max(...chunk.map(({ temp2m }) => temp2m))
      });

      chunkDay++;
    }

    return {
      data: forecastResult,
      message: forecastData
        ? 'Forecast data successfully retrieved'
        : 'Unable to retrieve forecast data'
    };
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
    getForecast
  };
}

export default locationModel;
