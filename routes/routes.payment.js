const express = require('express');

const { createMoMoPayment, momoReturn, momoIPN, createVNPayPayment, vnpayReturn } = require('../controllers/controllers.payment');

const router = express.Router();

// Momo payment
router.post('/momo', createMoMoPayment); // Tạo thanh toán
router.get('/momo-return', momoReturn); // Xử lý kết quả
router.post('/momo-ipn', momoIPN); // Xử lý thông báo từ MoMo

// Vnpay 
router.post('/vnpay', createVNPayPayment); // Khởi tạo thanh toán VNPay
router.get('/vnpay-return', vnpayReturn); // Xử lý kết quả thanh toán

module.exports = router;
