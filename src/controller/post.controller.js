const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const client = new ImageKit();


// POST /api/posts/
async function createPostController(req,res) 
{
    // console.log(req.file); // file details aali RAM var
    // so aata file server varun RAM var send karun save kru

    const client = new ImageKit({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
    });

    // Finally, if none of the above are convenient, you can use our `toFile` helper:
    const file = await client.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: 'Test',
        folder : "cohort-2-insta-clone-posts"
    })

    // console.log(file);

    const post = await postModel.create({
        caption : req.body.caption,
        imgUrl : file.url,
        user : req.user.id
    })
    
    res.status(201).json({
        message : "send zali re image & file",
        post
    })
}

// GET /api/posts/
async function getPostController(req,res) 
{

    // console.log(decoded); // Ex : { id: '6993086990b3cbc3668caf10', iat: 1771243767, exp: 1771330167 }

    const userId = req.user.id;

    const posts = await postModel.find({
        user : userId
    })

    res.status(200).json({
        message : "Post fetched successfully",
        posts
    })
}

/**
 *  GET /api/posts/:details [protected]
 */

async function getPostDetailsController(req,res) 
{
    

    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);

    if(!post)
    {
        return res.status(404).json({
            message : "Post not found"
        })
    }

    const isValidUser = post.user.toString() === userId;

    if(!isValidUser)
    {
        return res.status(403).json({
            message : "Forbidden Content"
        })
    }

    return res.status(200).json({
        message : "Post fetched successfully",
        post
    })
}

module.exports = {
    createPostController,getPostController,getPostDetailsController             
}

