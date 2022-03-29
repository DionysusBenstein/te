const Redis = require("ioredis");

const client = new Redis();

// client.on("error", (err: any) => console.log("Redis Client Error", err));
// client.connect();

export default client;
