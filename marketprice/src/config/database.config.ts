import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));
try {
  client.connect();
} catch (err) {
  console.log(err);
}

export default client;
