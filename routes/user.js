const  express = require('express');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getResultSwab,
    importDataToMongo
} = require('../controllers/user');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

const { protectAdmin, authorize } = require('../middleware/auth');

router.use(protectAdmin);
// router.use(authorize('admin'))

router.route('/')
    .get(getUsers)
    .post(createUser)

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

router.route('/importexl').post(importDataToMongo)

router.route('/swab/:id').get(getResultSwab)


module.exports = router ;