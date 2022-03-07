import "dotenv/config";
import jayson from "jayson";
import _ from "lodash";
import { redirects } from "./rpc-redirects";
import { collapse } from "./util/rpc.util";

const port = process.env.PORT;

const server = new jayson.Server(collapse(redirects));

server.http().listen(port);
