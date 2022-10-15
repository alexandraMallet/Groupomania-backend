const express = require("express");
const router = express.Router();
const userCtr = require("../controllers/user");
const multer = require("../middleware/multer-config");


router.post("/signup", multer, userCtr.signup);
router.post("/login", userCtr.login);
router.put("/:id", userCtr.modifyUser);                   
router.delete("/:id", userCtr.deleteUser);   
router.get("/:id", userCtr.getOneUser);
router.get("/", userCtr.getAllUser);                


module.exports = router;