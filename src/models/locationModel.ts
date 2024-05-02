import { PrismaClient } from '@prisma/client';
import type { Location } from '@prisma/client';
// import { Decimal } from '@prisma/client/runtime/library';

function locationModel() {
  const prisma = new PrismaClient();

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
    getLocations
  };
}

export default locationModel;
