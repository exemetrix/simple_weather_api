import 'dotenv/config'; // .env config initialization
import express from 'express'; // Express framework
import helmet from 'helmet';
import locationRouter from './routers/locationRouter';
import { updateForecastsJob } from './config/cron-jobs';
// import db from './config/db'; // DB connection and helpers

const app = express();

app.use(helmet());
app.use(express.json());

app.use('/api/location', locationRouter());

app.get('/', (req, res) => {
  res.status(200).send('Hello world!');
});

app.listen(parseInt(process.env.EXPRESS_SERVER_PORT!, 10), () => {
  console.log(
    `Server running and listening on port ${process.env.EXPRESS_SERVER_PORT}`
  );
});

// Start forecasts update job
if (process.env.USE_CRON_UPDATE === 'true') {
  updateForecastsJob.start();
  console.log(
    'Forecasts update job will run on ' +
      updateForecastsJob.nextDate().toFormat('yyyy-MM-dd HH:mm:ss') +
      ' (local time)'
  );
}
