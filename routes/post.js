const express = require("express");
const router = express.Router();
const postCtr = require("../controllers/post");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

router.post("/", auth, multer, postCtr.createPost);    
router.get("/", auth, postCtr.getAllPosts);
router.get("/:id", auth, postCtr.getOnePost);
router.put("/:id", auth, multer, postCtr.modifyPost);
router.delete("/:id", auth, multer, postCtr.deletePost);
router.post("/:id/like", auth, postCtr.likeDislikePost);

module.exports = router;