// thread all models functions through db/models/index.js to then get threaded through db/index.js as objects with attached methods
module.exports = {
    // Products: require("./products"),
    User: require("./user"),
    // Cart: require("./cart"),
    // Orders: require("./orders"),
    // Reviews: require("./reviews"),
  };