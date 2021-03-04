const multer = require('multer')

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(csv|xlsx)$/)) {
        req.fileValidationError = 'Hanya file Csv dan Xlsx !';
        return cb(new Error('Hanya file Csv dan Xlsx !'), false);
    }
    cb(null, true);
};

exports.imageFilter = imageFilter;


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

exports.fileStorage = fileStorage