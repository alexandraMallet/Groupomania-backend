const express = require("express");
const router = express.Router();
const postCtr = require("../controllers/post");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

router.post("/", auth, multer, postCtr.createPost);    
router.get("/", postCtr.getAllPosts);
router.get("/:id", postCtr.getOnePost);
router.put("/:id", auth, multer, postCtr.modifyPost);
router.delete("/:id", auth, multer, postCtr.deletePost);

module.exports = router;