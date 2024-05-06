import { Request, Response /*, NextFunction */ } from 'express';
import { validationResult, matchedData } from 'express-validator';
import locationModel from '../models/locationModel';

function locationController() {
  const locationModelInst = locationModel();

  async function getLocation(req: Request, res: Response) {
    const validationErrors = validationResult(req);

    // Validation errors found on request query attributes
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const validatedData = matchedData(req);

    const locationData = await locationModelInst.getLocation(
      validatedData.slug
    );
    return locationData
      ? res.status(200).json(locationData)
      : res.sendStatus(500);
  }

  async function getLocations(req: Request, res: Response) {
    const locationsData = await locationModelInst.getLocations();
    return locationsData
      ? res.status(200).json(locationsData)
      : res.sendStatus(500);
  }

  async function createLocation(req: Request, res: Response) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }
    const validatedData = matchedData(req);
    const createdLocation = await locationModelInst.createLocation(
      validatedData.latitude,
      validatedData.longitude,
      validatedData.slug
    );
    return res.sendStatus(createdLocation ? 200 : 500);
  }

  async function updateLocation(req: Request, res: Response) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }
    const validatedData = matchedData(req);
    const updatedLocation = await locationModelInst.updateLocation(
      validatedData.latitude,
      validatedData.longitude,
      validatedData.name,
      validatedData.slug
    );
    return res.sendStatus(updatedLocation ? 200 : 500);
  }

  async function deleteLocation(req: Request, res: Response) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }
    const validatedData = matchedData(req);
    const deletedLocation = await locationModelInst.deleteLocation(
      validatedData.slug
    );
    return res.sendStatus(deletedLocation ? 200 : 500);
  }

  async function getForecast(req: Request, res: Response) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }
    const validatedData = matchedData(req);
    return res
      .status(200)
      .json(await locationModelInst.getForecast(validatedData.slug));
  }

  return {
    getLocation,
    getLocations,
    getForecast,
    createLocation,
    updateLocation,
    deleteLocation
  };
}

export default locationController;
