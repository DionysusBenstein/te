import express from "express";
import 'dotenv/config';
import jayson from 'jayson';
import cors from 'cors';
import _ from 'lodash';
import { redirects } from './rpc-redirects';
import { collapse } from './util/collapse.util';

const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());
app.use(cors())

const redirectsCollapsed = collapse(redirects);
const rpcServer = new jayson.Server(redirectsCollapsed);

app.post("/", rpcServer.middleware());

app.get("/", (req, res) => {
  res.send("router healthcheck\n");
});

app.listen(port, () => console.log(`Running on port ${port}`));
