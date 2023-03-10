require("dotenv").config();

module.exports = {
  project_name: process.PROJECT_NAME || "gamilms",
  host: process.HOST_IP || "localhost",
  port: process.PORT || 3000,
  passport: {
    clientID: process.PASSPORT_CLIENT_ID || "Your Facebook ID",
    clientSecret: process.PASSPORT_CLIENT_SECRET || "Your Facebook Secret",
  },
  mongodb_url:
    process.MONGODB_URL || "mongodb://localhost:27017/gamilms_express",
};
