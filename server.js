const express = require('express');
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
const gm = require("gm");
const app = express();
app.post('/api/files', upload.single('file'), (req, res) => {
    gm(req.file.path)
        .resize(720)
        .write('uploads/small_' + req.file.filename, () => {
    });
    gm(req.file.path)
        .resize(1280)
        .write('uploads/medium_' + req.file.filename, () => {
    });
    gm(req.file.path)
        .resize(2044)
        .write('uploads/big_' + req.file.filename, () => {
    });
    res.status(200).json({ success: true });
});
app.use('/static', express.static('uploads'));
app.listen(process.env.PORT || 4000, function () {
    console.log('Your node js server is running');
});
//# sourceMappingURL=server.js.map