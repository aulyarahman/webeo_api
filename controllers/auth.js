const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const QRCode = require('qrcode');


// @desc    login User
// @route   POST /api/v1/auth/login
// @acess   Public
exports.login = asyncHandler(async (req, res, next) => {
    const { noHandphone } = req.body;

    // validate email & pasword
    if(!noHandphone) {
        return next(new ErrorResponse('Check your number phone', 400));
    }

    // check for user
    const user = await User.findOne({ noHandphone: noHandphone });

    if(!user) {
        return next(new ErrorResponse('Your number phone not registerd', 401));
    }


    // create token
    sendTokenResponse(user, 200, res)
});

// @desc    get check nohp
// @route   GET /api/v1/auth/check
// @acess   Private
exports.checkNohp = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ noHandphone: req.params.check });

    if(!user) {
        return next(new ErrorResponse('Akun tidak di temukan', 404));
    }

    res.status(200).json({
        success: true,
        data: user
    })
});


// @desc    get current login user
// @route   GET /api/v1/auth/me
// @acess   Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    })
});


// @desc    get current login user
// @route   GET /api/v1/auth/me
// @acess   Private
exports.getMeSpg = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ noHandphone: req.params.id });

    if(!user) {
        return next(new ErrorResponse('Akun tidak di temukan', 404));
    }

    if(user.hasilSwab === 'Belum Ada') {
        return next(new ErrorResponse('Mohon lakukan test SWAB terlebih dahulu', 404));
    }

    const dataa = { statusKehadiran: 'Hadir' }

    await User.findByIdAndUpdate(user._id, dataa)

    res.status(200).json({
        success: true,
        data: user
    })
});


// @desc    number phone Qr Code
// @route   GET /api/v1/auth/qrcode
// @acess   Public
exports.getQrCode = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.user.id);

    const { noHandphone } = user

    const resQrcode = await QRCode.toString(noHandphone.toString());

    res.status(200).json({
        success: true,
        data: resQrcode
    })
    
})




// Get token from model, create cookie and send respon
const sendTokenResponse = (user, statusCode, res) => {
    // create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'productions') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({ 
            success: true,
            token
        })
};