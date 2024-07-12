const express = require('express');
const { registerUser, loginUser ,updateUser,deleteUser} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/update',updateUser);
router.post('/delete',deleteUser);
module.exports = router;
