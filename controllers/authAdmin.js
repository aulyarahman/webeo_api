const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Admin = require('../models/Admin');


// @desc    login Admin
// @route   POST /api/v1/auth/login/admin
// @acess   Public
exports.login = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    // validate email & pasword
    if(!username || !password) {
        return next(new ErrorResponse('Mohon periksa kembali username atau password', 400));
    }

    // check for user
    const user = await Admin.findOne({ username }).select('+password');

    if(!user) {
        return next(new ErrorResponse('User tidak ditemukan', 401));
    }

    // check if password match
    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
        return next(new ErrorResponse('Password salah', 401));
     }


    // create token
    sendTokenResponse(user, 200, res)
});



// @desc    Create Admin
// @route   POST /api/v1/auth/addAdmin
// @acess   Private/Admin
exports.createAdmin = asyncHandler(async (req, res, next) => {
   
    const user = await Admin.create(req.body);

    res.status(201).json({ success: true, data: user })
});




// @desc    logout / clear cookies
// @route   GET /api/v1/auth/admin/logout
// @acess   Private
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: {}
    })
});




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