const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignup);

//rn this will remove the session (logout button on nav bar)
router.post('/logout', authController.postLogout);

module.exports = router;
