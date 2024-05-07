import { CronJob } from 'cron';
import LocationModel from '../models/locationModel';

const locationModelInst = LocationModel();

const updateForecastsJob = CronJob.from({
  cronTime: '0 0 11 * * *',
  onTick: () => {
    console.log('Forecasts update job: starting update...');
    locationModelInst.updateForecasts();
  }
});

export { updateForecastsJob };
