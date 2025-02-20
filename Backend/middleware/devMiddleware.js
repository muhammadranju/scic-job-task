const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const middleware = [
  express.json(),
  express.urlencoded({ extended: true }),
  cors({
    origin: "*",
    credentials: true,
  }),
  morgan("dev"),
];

module.exports = middleware;
