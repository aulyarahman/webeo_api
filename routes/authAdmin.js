const  express = require('express');
const {
    login,
    logout,
    createAdmin
} = require('../controllers/authAdmin');

const router = express.Router();


router.post('/login', login);
router.post('/logout', logout);
router.post('/add', createAdmin);




module.exports = router ;