const crypto = require('crypto');
const axios = require('axios');

const momoConfig = {
    partnerCode: 'MOMO',
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY,
    endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create',
    redirectUrl: process.env.CLIENT_URL,
    ipnUrl: process.env.SERVER_URL + '/api/payment/momo-ipn',
};

// Hàm tạo URL thanh toán MoMo
const createPayment = async ({ amount, orderInfo }) => {
  const orderId = momoConfig.partnerCode + new Date().getTime();
  const requestId = `${new Date().getTime()}`;

  const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

  const signature = crypto.createHmac('sha256', momoConfig.secretKey).update(rawSignature).digest('hex');

  const requestBody = JSON.stringify({
      partnerCode: momoConfig.partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: momoConfig.redirectUrl,
      ipnUrl: momoConfig.ipnUrl,
      lang: 'vi',
      requestType: 'payWithMethod',
      autoCapture: true,
      extraData: '',
      orderGroupId: '',
      signature,
  });

  try {
      const response = await axios.post(momoConfig.endpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody)
        },
      });
      return response.data;
  } catch (error) {
      throw new Error('Failed to create MoMo payment');
  }
};

// Hàm xác minh chữ ký từ MoMo
const verifyMomoSignature = (data, signature) => {
    const { accessKey, amount, extraData, message, orderId, orderInfo, partnerCode, requestId, resultCode } = data;
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&requestId=${requestId}&resultCode=${resultCode}`;

    const computedSignature = crypto.createHmac('sha256', momoConfig.secretKey).update(rawSignature).digest('hex');
    return computedSignature === signature;
};

module.exports = { createPayment, verifyMomoSignature };
