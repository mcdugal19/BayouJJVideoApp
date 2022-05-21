const client = require("./client");
const models = require("./models");

// All needed exports are threaded through this db/index.js
module.exports = {
  client,
  ...models,
};
