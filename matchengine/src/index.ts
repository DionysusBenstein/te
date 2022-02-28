import express from 'express';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('matchengine healthcheck');
});

app.listen(port, () => console.log(`Running on port ${port}`));