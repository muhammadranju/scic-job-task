const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const middleware = [
  express.json(),
  express.urlencoded({ extended: true }),
  cors({
    origin: "https://task-manager-9f8db.web.app" || "http://localhost:5173",
    credentials: true,
  }),
  morgan("dev"),
];

module.exports = middleware;
