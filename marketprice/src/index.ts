import express from "express";
import "dotenv/config";
import _ from "lodash";
import jayson from "jayson";
import { methods } from "./rpc";
import { collapse } from "./utils/rpc.util";

const app = express();
const port = process.env.PORT || 3000;
const map = _.reduce(methods, collapse("", "."), {});

app.use(express.json());

app.post("/", new jayson.Server(map).middleware());
app.get("/", (req, res) => {
  res.send("marketprice healthcheck\n");
});

app.listen(port, () => console.log(`Running on port ${port}`));
