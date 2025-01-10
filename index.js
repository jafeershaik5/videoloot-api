const express = require("express");
const cors = require("cors");
require("dotenv").config();

const instadlHandler = require("./api/instadl");
const xdlHandler = require("./api/xdl");
const fbdlHandler = require("./api/fbdl");
const ytdlHandler = require('./api/ytdl')

const port = process.env.PORT || 4000;
const app = express();

// CORS Configuration
app.use(
    cors({
        origin: function (origin, callback) {
            const allowedOrigins = [
                "http://localhost:5173",
                "https://videoloot.vercel.app", // Replace with your actual frontend URL
            ];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

// Base Route
app.get("/", (req, res) => {
    res.json("VideoLoot - Online Media Downloader");
});

// Proxy Route for Video Stream
app.get("/proxy", async (req, res) => {
    const got = require("got");
    const videoUrl = req.query.url;
    try {
        const stream = got.stream(videoUrl, { timeout: 60000 });
        stream.on("response", (response) => {
            res.set("Content-Type", response.headers["content-type"]);
            res.set("Content-Length", response.headers["content-length"]);
        });
        stream.pipe(res);
    } catch (err) {
        console.error("Error fetching video:", err.message);
        res.status(500).json({ message: "Error fetching video" });
    }
});

// Modular Routes
app.get("/instadl", instadlHandler);
app.get("/xdl", xdlHandler);
app.get("/fbdl", fbdlHandler);
app.get('/ytdl', ytdlHandler)

// Start Server for Local Environment
if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => {
        console.log(`Server is running on PORT: ${port}`);
    });
}

module.exports = app;