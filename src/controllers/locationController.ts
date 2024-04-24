import { Request, Response /*, NextFunction */ } from 'express';
import locationModel from '../models/locationModel';

function locationController() {
  const locationModelInst = locationModel();

  async function getLocation(req: Request, res: Response) {
    const { id } = req.query;

    if (id == null) {
      return res.sendStatus(400);
    }

    const locationData = await locationModelInst.getLocation(
      parseInt(id as string, 10)
    );
    return locationData
      ? res.status(200).json(locationData)
      : res.status(500).json(undefined);
  }

  return { getLocation };
}

export default locationController;
