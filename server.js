"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, callback) {
        callback(null, file.originalname);
    }
});
let gm;
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : "production";
if (process.env.NODE_ENV === "development") {
    gm = require("gm");
}
else {
    gm = require("gm").subClass({
        imageMagick: true
    });
}
const app = express();
app.use(cors());
const upload = multer({ storage: storage }).array('file');
app.post('/api/videos', function (req, res) {
    upload(req, res, function (err) {
        const videoFiles = req.files;
        let fmpg = ffmpeg();
        console.log("dirname: " + __dirname);
        // ffmpeg.setFfmpegPath(path.join(__dirname, '../../ffmpeg/bin/ffmpeg.exe'));
        // ffmpeg.setFfprobePath(path.join(__dirname, '../../ffmpeg/bin/ffprobe.exe'));
        videoFiles.forEach(function (file) {
            fmpg = fmpg.addInput(file.filename);
        });
        fmpg.mergeToFile('.uploads/mergedVideo', './tmp/')
            .on('start', function (cli) {
            console.log('starting', cli);
        })
            .on('error', function (err) {
            console.log('Error ' + err.message);
        })
            .on('end', function () {
            console.log('Finished!');
        });
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});
app.use('/static', express.static('uploads'));
app.use('', express.static('dist'));
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});
app.listen(process.env.PORT || 4000, function () {
    console.log('Your node js server is running');
});
//# sourceMappingURL=server.js.map