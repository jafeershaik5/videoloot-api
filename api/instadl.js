const { ndown } = require("nayan-videos-downloader");
const { filterUniqueImages, processMediaData } = require("../utils");

const instadlHandler = async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ message: "URL parameter is required" });
    }

    try {
        const info = await ndown(url);
        if (!info.status) {
            return res.status(403).json({ message: "Cannot download videos from private pages" });
        }

        const data = filterUniqueImages(info.data);
        if (data && data.length > 0) {
            const processedData = await processMediaData(data);
            return res.json(processedData);
        } else {
            return res.status(404).json({ message: "No media found" });
        }
    } catch (error) {
        console.error("Error in /instadl:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = instadlHandler;