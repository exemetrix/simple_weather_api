import { PrismaClient } from '@prisma/client';
import type { location } from '@prisma/client';

function locationModel() {
  const prisma = new PrismaClient();

  async function getLocation(id: number): Promise<location | undefined> {
    try {
      const locationData = await prisma.location.findUnique({
        where: { id }
      });
      return locationData ? locationData : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async function getLocations(): Promise<location[]> {
    try {
      const locationsData = await prisma.location.findMany();
      return locationsData;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async function updateLocation(
    id: number,
    latitude: number,
    longitude: number,
    name: string,
    slug: string
  ) {
    try {
      const updatedLocation = await prisma.location.update({
        where: { id },
        data: {
          latitude,
          longitude,
          name,
          slug
        }
      });
      return updatedLocation != null;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  return {
    getLocation,
    getLocations,
    updateLocation
  };
}

export default locationModel;
