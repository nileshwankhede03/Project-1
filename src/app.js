const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials : true, // used to allow set cookies on client-side [ credentials & origin is must ]
    origin : "http://localhost:5173"
}))

/* require routes */
const authRouter = require("./routes/auth.routes")
const postRouter = require("./routes/post.routes")
const userRouter = require("./routes/user.routes")

/* use routes */
app.use("/api/auth",authRouter);
app.use("/api/posts",postRouter);
app.use("/api/users",userRouter);

module.exports = app;