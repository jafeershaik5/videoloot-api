const { twitterdown } = require("nayan-videos-downloader");
const { processMediaData } = require("../utils");

const xdlHandler = async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ message: "URL parameter is required" });
    }

    try {
        const info = await twitterdown(url);
        const dataStatus = Object.values(info.data)[0];

        if (dataStatus === undefined) {
            return res.status(403).json({ message: "Media not found" });
        }

        const data = Object.entries(info.data).map(([resolution, url]) => ({
            resolution,
            url,
        }));

        if (data && data.length > 0) {
            const processedData = await processMediaData(data);
            return res.json(processedData);
        } else {
            return res.status(404).json({ message: "No media found" });
        }
    } catch (error) {
        console.error("Error in /xdl:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = xdlHandler;