const { createUser, userLogin } = require("../controllers/users.controller");

const router = require("express").Router();

router.route("/").post(createUser);
router.route("/login").post(userLogin);

module.exports = router;
