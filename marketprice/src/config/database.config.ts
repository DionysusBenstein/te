import Redis from "redis";

const redisClient = Redis.createClient();

redisClient.on("connect", function () {
  console.log("connected");
});

export default redisClient;
