const express = require('express');
const router = express.Router();
const adminRoutes = require('./src/adminRoutes');
const studentRoutes = require('./src/studentRoutes');
const stuactRoutes = require('./src/stuactRoutes');
// 
// const login = require('./src/login');

router.use('/admin', adminRoutes);
router.use('/student', studentRoutes);
router.use('/stuact', stuactRoutes);
// 
// router.use('/student', login);

module.exports = router;
