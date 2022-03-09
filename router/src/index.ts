import "dotenv/config";
import jayson from "jayson";
import _ from "lodash";
import { redirects } from "./rpc-redirects";
import { collapse } from "./util/collapse.util";

const port = process.env.PORT;

const redirectsCollapsed = collapse(redirects);

const server = new jayson.Server(redirectsCollapsed);

server.http().listen(port);
