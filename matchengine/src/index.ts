import express from 'express';
import 'dotenv/config';

import router from './routes/index';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
    res.send('matchengine healthcheck');
});

app.listen(port, () => console.log(`Running on port ${port}`));