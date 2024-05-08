import { CronJob } from 'cron';
import LocationModel from '../models/locationModel';

const locationModelInst = LocationModel();

const updateForecastsJob = CronJob.from({
  cronTime: process.env.FORECAST_UPDATE_CRON!,
  onTick: async () => {
    console.log('Forecasts update job: starting update...');
    await locationModelInst.updateForecasts();
    console.log(
      'Next forecasts update will run on ' +
        updateForecastsJob.nextDate().toFormat('yyyy-MM-dd HH:mm:ss') +
        ' (local time)'
    );
  }
});

export { updateForecastsJob };
