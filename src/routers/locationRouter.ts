import express from 'express';
import locationController from '../controllers/locationController';
import { body, query } from 'express-validator';

function locationRouter() {
  const router = express.Router();
  const controller = locationController();

  router.get(
    '',
    query('slug', 'Location Slug must be specified').notEmpty(),
    controller.getLocation
  );
  router.get('/all', controller.getLocations);
  router.post(
    '',
    body('slug').notEmpty().isLength({ max: 255 }),
    body('latitude', 'Latitude must be within -90 and 90 degrees').isFloat({
      min: -90,
      max: 90
    }),
    body(
      'longitude',
      'Longitude value must be within -180 and 180 degrees'
    ).isFloat({ min: -180, max: 180 }),
    controller.createLocation
  );
  router.put(
    '',
    body('slug').notEmpty().isLength({ max: 255 }),
    body('latitude', 'Latitude must be within -90 and 90 degrees')
      .isFloat({
        min: -90,
        max: 90
      })
      .optional(),
    body('longitude', 'Longitude value must be within -180 and 180 degrees')
      .isFloat({ min: -180, max: 180 })
      .optional(),
    body('name', 'Location name must have a maximum of 220 chars').isLength({
      max: 220
    }),
    controller.updateLocation
  );
  router.delete(
    '',
    body('slug', 'Slug must be defined').notEmpty(),
    controller.deleteLocation
  );

  return router;
}

export default locationRouter;
