import 'dotenv/config'; // .env file
import express from 'express'; // Express framework
import helmet from 'helmet';
import db from './config/db'; // DB connection and helpers

const app = express();

app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Hello world!');
});

app.listen(parseInt(process.env.EXPRESS_SERVER_PORT!, 10), () => {
    console.log(`Server running and listening on port ${process.env.EXPRESS_SERVER_PORT}`);
});