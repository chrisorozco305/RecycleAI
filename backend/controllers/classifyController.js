exports.classifyImage = async (req, res) => {
    try {
        const imageBase64 = req.file.buffer.toString("base64");

        // Placeholder response since AI model isn't available
        res.json({
            message: "AI model is not integrated yet",
            imageSize: `${imageBase64.length} characters (Base64)`,
            prediction: "No AI model available",
        });
    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ error: "Classification failed" });
    }
};
