const express = require("express");
const router = express.Router();
const userCtr = require("../controllers/user");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");


router.post("/signup", multer, userCtr.signup);
router.post("/login", userCtr.login);
router.put("/:id", auth, multer, userCtr.modifyUser);                   
router.delete("/:id", auth, userCtr.deleteUser);   
router.get("/:id", userCtr.getOneUser);
router.get("/", auth, userCtr.getAllUser);                


module.exports = router;