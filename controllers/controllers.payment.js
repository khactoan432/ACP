const { createPayment, verifyMomoSignature } = require('../payment/momo');
const { createPaymentUrl, verifyVnpaySignature } = require('../payment/vnpay');
const axios = require('axios');

// Khởi tạo thanh toán MoMo
const createMoMoPayment = async (req, res) => {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';
    var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var requestType = "payWithMethod";
    var amount = '50000';
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData ='';
    var orderGroupId ='';
    var autoCapture =true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode : partnerCode,
        partnerName : "Test",
        storeId : "MomoTestStore",
        requestId : requestId,
        amount : amount,
        orderId : orderId,
        orderInfo : orderInfo,
        redirectUrl : redirectUrl,
        ipnUrl : ipnUrl,
        lang : lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData : extraData,
        orderGroupId: orderGroupId,
        signature : signature
    });

    //Create the HTTPS objects
    const options = {
        method: 'POST',
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        },
        data: requestBody,
    }

    let result; 
    try {
        result = await axios(options);

        return res.status(200).json(result.data)
    } catch (error) {
        console.error('Error creating MoMo payment:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
};

// Xử lý kết quả thanh toán (Redirect URL)
const momoReturn = (req, res) => {
    const query = req.query;

    if (query.resultCode === '0') {
        res.status(200).json({ message: 'Thanh toán thành công!', query });
    } else {
        res.status(400).json({ message: 'Thanh toán thất bại!', query });
    }
};

// Xử lý thông báo từ MoMo (IPN)
const momoIPN = (req, res) => {
    const { signature, ...data } = req.body;

    if (verifyMomoSignature(data, signature)) {
        if (data.resultCode === 0) {
            console.log('Giao dịch thành công:', data);
            res.status(200).send('success');
        } else {
            console.log('Giao dịch thất bại:', data);
            res.status(400).send('failure');
        }
    } else {
        console.error('Chữ ký không hợp lệ:', data);
        res.status(400).send('invalid signature');
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
