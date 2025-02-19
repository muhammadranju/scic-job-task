const express = require("express");
const middleware = require("./middleware/devMiddleware");
const router = require("./routers");
const app = express();

app.use([middleware, router]);

module.exports = app;
