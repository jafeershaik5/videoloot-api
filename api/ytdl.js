const { ytdown } = require("nayan-videos-downloader");
const { getFileType, createUniqueFileName } = require("../utils");
const getThumbnail = require("../ytThumbnail");

const ytdlHandler = async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ message: "URL parameter is required" });

    try {
        const info = await ytdown(url);
        if (!info.status) return res.status(403).json({ message: "Video not found" });

        const { contentType, fileExtension } = await getFileType(info.data.video);
        const thumbnail = getThumbnail(url, "mq");
        const fileName = createUniqueFileName();

        const responseData = [{
            contentType,
            fileExtension,
            fileName,
            thumbnail,
            title: `${info.data.title.slice(0, 30)}...`,
            video: info.data.video,
            video_hd: info.data.video_hd,
            audio: info.data.audio
        }];

        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error in /ytdl:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = ytdlHandler;