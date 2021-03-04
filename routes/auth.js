const  express = require('express');
const {
    login,
    getQrCode,
    getMe,
    getMeSpg,
    checkNohp
} = require('../controllers/auth');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.get('/qrcode', protect, getQrCode, function(req, res) {
    res.setHeader('Content-type', 'image/png');
});
router.get('/check/:check', checkNohp)
router.get('/me', protect, getMe)
router.get('/spg/:id', getMeSpg)




module.exports = router ;