const express = require('express');
const path = require('path');

const multer = require("multer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({
    storage: multer.memoryStorage()
});

app.use(express.static(path.join(__dirname, 'public')));

app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: "Please select a file."
        });
    }

    try {
        const formData = new FormData();

        formData.append(
            "file",
            new Blob([req.file.buffer], {
                type: req.file.mimetype
            }),
            req.file.originalname
        );

        const response = await fetch(
            "https://postfile.net/v1/upload",
            {
                method: "POST",
                headers: {
                    "X-API-Key": process.env.POSTFILE_API_KEY
                },
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.detail || "External upload failed."
            });
        }

        res.json({
            message: "Upload successful!",
            filename: data.name,
            url: data.url
        });

    } catch (error) {
        console.error("Upload error:", error.message);

        res.status(500).json({
            error: "Something went wrong during the upload."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});