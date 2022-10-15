const express = require("express");
const router = express.Router();
const postCtr = require("../controllers/post");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

router.post("/", auth, multer, postCtr.createPost);    


module.exports = router;