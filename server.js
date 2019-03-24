const cors = require("cors");
const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const multer = require("multer");
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
        cb(null, 'uploads/');
    },
    filename(req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = multer({ storage: storage }).array('file');
app.post('/api/videos', function (req, res) {
    upload(req, res, function (err) {
        const videoFiles = req.files;
        let fmpg = ffmpeg();
        videoFiles.forEach(function (file) {
            fmpg = fmpg.addInput(file.filename);
        });
        fmpg.mergeToFile('.uploads/zusammengefügt.mp4', './uploads/')
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