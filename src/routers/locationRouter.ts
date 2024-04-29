import express from 'express';
import locationController from '../controllers/locationController';
import { query } from 'express-validator';

function locationRouter() {
  const router = express.Router();
  const controller = locationController();

  router.get(
    '',
    query('id', 'Location ID must be an integer').notEmpty().isInt({ min: 0 }),
    controller.getLocation
  );

  return router;
}

export default locationRouter;
