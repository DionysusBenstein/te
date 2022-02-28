import express from 'express';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('readhistory healthcheck');
});

app.listen(port, () => console.log(`Running on port ${port}`));