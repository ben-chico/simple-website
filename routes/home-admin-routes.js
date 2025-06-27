const express = require('express');
const router = express.Router();
const {homeMiddleware, adminMiddleware} = require('../middlewares/home-admin-middleware');


router.get('/home',homeMiddleware, (req, res)=>{
    res.json(`welcome to the home page ${req.userInfo.username}`);
})

router.get('/admin',homeMiddleware, adminMiddleware, (req, res)=>{
    res.json(`welcome to the admin page ${req.userInfo.username}`);
})

module.exports = router;