import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
const app = express();
app.use(helmet());
app.use(express.json());
app.get('/', (req, res) => {
    res.status(200).send('Hello world!');
});
app.listen(parseInt(process.env.EXPRESS_SERVER_PORT, 10), () => {
    console.log(`Server running and listening on port ${process.env.EXPRESS_SERVER_PORT}`);
});
//# sourceMappingURL=server.js.map