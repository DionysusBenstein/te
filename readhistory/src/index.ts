import express from "express";
import "dotenv/config";
import _ from "lodash";
import jayson from "jayson";
import { methods } from "./rpc";
import { collapse } from "./utils/rpc.utils";

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

const map = _.reduce(methods, collapse("", "."), {});

app.post("/", new jayson.Server(map).middleware());

app.get("/", (req, res) => {
  res.send("readhistory healthcheck\n");
});

app.listen(port, () => console.log(`Running on port ${port}`));
