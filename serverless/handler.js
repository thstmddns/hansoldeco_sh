const AWS = require('aws-sdk');
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage for processing the file
const upload = multer({ storage: storage });
const crypto = require('crypto');


const app = express();
app.use(cors());

const s3 = new AWS.S3();

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('File is required');
    }

    // if file is larger than 10mb, API 게이트웨이는 10MB 제한, Lambda는 6MB 제한
    if (req.file.size > 10000000) {
        return res.status(400).send('File size must be under 10mb');
    }

    // if filename is larger than 50 characters
    if (req.file.originalname.length > 50) {
        return res.status(400).send('File name must be under 50 characters');
    }

    const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');

    const newFileName = `${req.file.originalname.split('.').slice(0, -1).join('.')}-${hash}.${req.file.originalname.split('.').pop()}`;


    const params = {
        Bucket: 'dfinite',
        Key: `sosohaja/${newFileName}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    };

    try {
        const result = await s3.upload(params).promise();
        return res.status(200).send(result.Location);
    } catch (error) {
        return res.status(500).send('Error uploading file');
    }
});

module.exports.handler = serverless(app);
