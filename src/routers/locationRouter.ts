import express from 'express';
import locationController from '../controllers/locationController';

function locationRouter() {
  const router = express.Router();
  const controller = locationController();

  router.get('', controller.getLocation);

  return router;
}

export default locationRouter;
