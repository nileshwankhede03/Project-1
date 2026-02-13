const express = require("express");
const postRouter = express.Router();
const postController = require("../controller/post.controller")
const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


/**
 * POST /api/posts [protected] : means without token post nahi honar
 * - req.body = {caption, image-file}
 * /api/posts/
 */
// single router la middleware middle la taktat

postRouter.post("/", upload.single("chacha"), postController.createPostController);

module.exports = postRouter;

/**
     * .single(fieldname)
    Accept a single file with the name fieldname. The single file will be stored in req.file.
 */