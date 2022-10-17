const express = require("express");
const router = express.Router();
const adminCtr = require("../controllers/admin");

router.post("/signup", adminCtr.signup);
router.post("/login", adminCtr.login);
router.put("/:id", adminCtr.modify);
router.delete("/:id", adminCtr.delete);
router.get("/:id", adminCtr.getAdmin);


module.exports = router;