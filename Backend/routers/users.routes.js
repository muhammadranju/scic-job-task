const { createUser } = require("../controllers/users.controller");

const router = require("express").Router();

router.route("/").post(createUser);

module.exports = router;
