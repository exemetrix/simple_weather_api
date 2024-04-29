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
      parseInt(validatedData.id as string, 10)
    );
    return locationData
      ? res.status(200).json(locationData)
      : res.sendStatus(500);
  }

  return { getLocation };
}

export default locationController;
