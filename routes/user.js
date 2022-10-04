const express = require("express");
const router = express.Router();
const userCtr = require("../controllers/user");

router.post("/signup", userCtr.signup);
router.post("/login", userCtr.login);
router.put("/", userCtr.modifyUser);                   //chemin ?
router.delete("/", userCtr.deleteUser);                   //chemin ?
router.put("/", userCtr.unlog);                   //chemin ?

module.exports = router;