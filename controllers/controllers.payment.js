const { createPayment, verifyMomoSignature } = require('../payment/momo');
const { createPaymentUrl, verifyVnpaySignature } = require('../payment/vnpay');
const { Order } = require("../models");
const mongoose = require('mongoose');

// Create MoMo payment
const createMoMoPayment = async (req, res) => {
    const { id_user, id_material, type, amount } = req.body;

    if (!id_user || !id_material || !type) {
        return res.status(400).json({ message: 'Missing required information.' });
    }

    try {
        const paymentResult = await createPayment({
            amount: Number(amount),
            orderInfo: 'Pay with MoMo',
        });

        if (paymentResult.success && paymentResult.data.resultCode === 0) {
            const { orderId } = paymentResult;

            const order = await Order.create({
                code: orderId,
                id_user,
                id_material,
                type,
                amount,
                payment_status: 'pending',
            });

            return res.status(200).json({ message: 'Payment created successfully.', data: paymentResult.data });
        }

        return res.status(400).json({ message: 'Payment failed.', error: paymentResult.error });
    } catch (error) {
        console.error('Error creating MoMo payment:', error);
        return res.status(500).json({ message: 'Server error while creating payment.', error: error.message });
    }
};

// Handle MoMo return URL
const momoReturn = (req, res) => {
    try {
        const { signature, ...data } = req.query;

        if (!verifyMomoSignature(data, signature)) {
            return res.redirect(`http://localhost:3000?status=invalid_signature`);
        }

        if (Number(data.resultCode) === 0) {
            return res.redirect(`http://localhost:3000?status=success`);
        }

        return res.redirect(`http://localhost:3000?status=failure`);
    } catch (error) {
        console.error('Error processing MoMo return:', error);
        return res.redirect(`http://localhost:3000?status=error`);
    }
};

// Handle MoMo IPN
const momoIPN = async (req, res) => {
    try {
        const { signature, ...data } = req.body;

        if (!verifyMomoSignature(data, signature)) {
            const order = await Order.findOneAndUpdate(
                { code: data.orderId },
                { payment_status: 'paid', method: data.payType },
                { new: true, runValidators: true }
            );
            if (!order) {
                return res.status(404).json({ message: 'Order not found!' });
            }
            console.log({ message: 'Invalid signature!' });
            return res.status(400).json({ message: 'Invalid signature!' });
        }

        if (Number(data.resultCode) === 0) {
            const order = await Order.findOneAndUpdate(
                { code: data.orderId },
                { payment_status: 'paid', method: data.payType },
                { new: true, runValidators: true }
            );

            if (!order) {
                return res.status(404).json({ message: 'Order not found!' });
            }

            console.log({ message: 'Payment successfully!' });
            return res.status(200).json({ message: 'Payment successfully!' });
        }

        return res.status(400).json({ message: 'Payment failed!' });
    } catch (error) {
        console.error('Error processing MoMo IPN:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Tạo URL thanh toán VNPay
const createVNPayPayment = (req, res) => {
  try {
        ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
      const { amount, bankCode } = req.body;

      // Tạo URL thanh toán
      const paymentUrl = createPaymentUrl({ amount, bankCode, ipAddr });

      res.status(200).json({
          message: 'Tạo giao dịch thành công!',
          paymentUrl,
      });
  } catch (error) {
      console.error('Error creating VNPay payment:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi tạo giao dịch', error });
  }
};

// Xử lý kết quả thanh toán (Return URL)
const vnpayReturn = (req, res) => {
  const query = req.query;

  if (verifyVnpaySignature(query)) {
      if (query.vnp_ResponseCode === '00') {
          res.status(200).json({
              message: 'Thanh toán thành công!',
              data: query,
          });
      } else {
          res.status(400).json({
              message: 'Thanh toán thất bại!',
              error: query,
          });
      }
  } else {
      res.status(400).json({ message: 'Chữ ký không hợp lệ!' });
  }
};

module.exports = { createMoMoPayment, momoReturn, momoIPN, createVNPayPayment, vnpayReturn };
