const express = require("express");
const router = express.Router();
const postCtr = require("../controllers/post");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

router.post("/", auth, multer, postCtr.createPost);    //front ok
router.get("/", auth, postCtr.getAllPosts);             //front ok
router.get("/:id", auth, postCtr.getOnePost);            //front ok
router.put("/:id", auth, multer, postCtr.modifyPost);      //front ok
router.delete("/:id", auth, multer, postCtr.deletePost);      //front ok
router.post("/:id/like", auth, postCtr.likeDislikePost);      // front TODO

module.exports = router;