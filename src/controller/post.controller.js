const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const client = new ImageKit();
const jwt = require("jsonwebtoken");

// POST /api/posts/
async function createPostController(req,res) 
{
    // console.log(req.file); // file details aali RAM var
    // so aata file server varun RAM var send karun save kru

    const token = req.cookies.token;

    if(!token)
    {
        return res.status(401).json({
            message : "Token not provided, Unauthorized access"
        })
    }

    let decoded = null;
    try
    {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch(e)
    {
        return res.status(401).json({
            message : "user not authorized"
        })
    }

    const client = new ImageKit({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
    });

    // Finally, if none of the above are convenient, you can use our `toFile` helper:
    const file = await client.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: 'Test',
        folder : "cohort-2-insta-clone-posts"
    })

    console.log(file);
    

    const post = await postModel.create({
        caption : req.body.caption,
        imgUrl : file.url,
        user : decoded.id
    })
    
    res.status(201).json({
        message : "send zali re image & file",
        post
    })
}

module.exports = {
    createPostController
}

