const ErrorResponse = require('../utils/errorResponse');
const asyncHanlder  = require('../middleware/async');
const User = require('../models/User');

const csvtojson = require('csvtojson');
const del = require('del');
const path = require('path');
const excelToJson = require('convert-excel-to-json');



// @desc GET All Users
// @route GET /api/v1/auth/users
// @access private/admin
exports.getUsers = asyncHanlder(async (req, res, next) => {
    const user = await User.find({}).sort({createdAt: -1})
    res.status(200).json({success: true, data: user})
});


// @desc GET single Users
// @route GET /api/v1/auth/users/:id
// @access private/admin
exports.getUser = asyncHanlder(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({ success: true, data: user});
})


// @desc Create user
// @route POST /api/v1/auth/users
// @access private/admin
exports.createUser = asyncHanlder(async (req, res, next) => {

    const user = await User.create(req.body);

    res.status(200).json({ success: true, data: user});
})


// @desc Update user
// @route PUT /api/v1/auth/users/:id
// @access private/admin
exports.updateUser = asyncHanlder(async (req, res, next) => {
    
    const cekFirst = await User.findById(req.params.id);
    if(cekFirst.noHandphone === req.body.noHandphone) {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
    }
    if(cekFirst.noHandphone !== req.body.noHandphone) {
        const cek = await User.findOne({ noHandphone: req.body.noHandphone })
        if(cek) {
            return next(new ErrorResponse('No handphone sudah terdaftar', 400));
        } 
        else if (!cek) {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });      
        }
    }
  



    res.status(200).json({ success: true, data: 'Berhasil update data' });
})


// @desc Delete user
// @route DELETE /api/v1/auth/users/:id
// @access private/admin
exports.deleteUser = asyncHanlder(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: 'Berhasil hapus data' });
})




// @desc check user hasilSwab
// @route GET /api/v1/auth/users/swab/:id
// @access private/spg
exports.getResultSwab = asyncHanlder(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    res.status(200).json({ success: true, data: user.hasilSwab });
})



// @desc import csv to db
// @route POST /api/v1/users/importcsv
// @access private
exports.importDataToMongo = asyncHanlder(async (req, res, next) => {
    
    let dataExcel ;
    let dataImport ;
    const file = req.file.path;

    const toJsonCsv = await csvtojson({noheader: false, headers: ['name','role','noHandphone','noKursi','statusKehadiran','hasilSwab']}).fromFile(file)

    const toJsonXlsx = await excelToJson({
        sourceFile: file,
        header:{
            rows: 1,
        },
        columnToKey: {
            A: 'name',
            B: 'role',
            C: 'noHandphone',
            D: 'noKursi',
            E: 'statusKehadiran',
            F: 'hasilSwab'
        },
    });

        Object.keys(toJsonXlsx)
            .forEach(function eachKey(key) { 
                dataExcel = toJsonXlsx[key];
        });

        if (path.extname(file) === '.csv') {
            dataImport = await User.create(toJsonCsv)
            del(file);
        }
        if (path.extname(file) === '.xlsx') {
            dataImport = await User.create(dataExcel)   
            del(file);
        }

      

    res.status(200).json({ success: true, data: dataImport });

})

