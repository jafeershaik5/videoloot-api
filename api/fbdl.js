const { ndown } = require("nayan-videos-downloader");
const { processMediaData } = require("../utils");

const fbdlHandler = async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ message: "URL parameter is required" });
    }

    try {
        const info = await ndown(url);
        if (!info.status) {
            return res.status(403).json({ message: "Media not found" });
        }

        if (info.data && info.data.length > 0) {
            const processedData = await processMediaData(info.data);
            return res.json(processedData);
        } else {
            return res.status(404).json({ message: "No media found" });
        }
    } catch (error) {
        console.error("Error in /fbdl:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = fbdlHandler;