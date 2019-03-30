const cors = require("cors");
const express = require('express');
const multer = require("multer");
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

app.all('*', function (req, res, next) {
    var origin = req.get('origin');
    res.header('Access-Control-Allow-Origin', origin);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, callback): void {
        callback(null, file.originalname);
    }
});

const accepted_extensions = ['mp3', 'wav', 'aac', 'wma', 'aiff', 'vtt'];
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (accepted_extensions.some(ext => file.originalname.endsWith("." + ext))) {
            return cb(null, true);
        }
        return cb(new Error('Only ' + accepted_extensions.join(", ") + ' files are allowed!'));
    }
}).array('file', 2);

app.post('api/audios', function (req, res) {
    upload(req, res, function (err) {

        const uploadFiles = req.files;

        if (err) {
            console.log("err: " + err);
            return res.end("Error uploading files.");
        }

        if (!uploadFiles) {
            return res.end("Please upload a file");
        }

        let files = fs.readdirSync('./uploads');

        //check if the are two files in the uploads folder
        if (files.length > 1) {
            let audio;
            let vtt;

            for (let file of files) {
                if (file.endsWith(".vtt")) {
                    vtt = "resources/" + file;
                } else {
                    audio = "resources/" + file;
                }
            }
            res.json({
                audio,
                vtt
            });
        }
    });
});

app.use(express.static('public'));
app.use('/resources',express.static(__dirname + '/uploads'));

app.listen(process.env.PORT || 4000, function () {
    console.log('Your node js server is running');
});
