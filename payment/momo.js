const crypto = require('crypto');
const axios = require('axios');

const momoConfig = {
    partnerCode: 'MOMO',
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY,
    endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create',
    redirectUrl: process.env.SERVER_URL + "/api/payment/momo-return",
    ipnUrl: process.env.SERVER_URL + '/api/payment/momo-ipn',
};

// Create MoMo payment URL
const createPayment = async ({ amount, orderInfo }) => {
    const { accessKey, secretKey, partnerCode, redirectUrl, ipnUrl } = momoConfig;

    const requestType = 'payWithMethod';
    const orderId = `${partnerCode}${Date.now()}`;
    const requestId = orderId;
    const extraData = '';

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = {
        partnerCode,
        partnerName: 'Test',
        storeId: 'MomoTestStore',
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        requestType,
        lang: 'vi',
        autoCapture: true,
        extraData,
        signature,
    };

    try {
        const response = await axios.post(momoConfig.endpoint, requestBody, {
            headers: { 'Content-Type': 'application/json' },
        });
        return { success: true, data: response.data, orderId };
    } catch (error) {
        console.error('Error in createPayment:', error.message);
        return { success: false, error: error.message };
    }
};

// Verify MoMo signature
const verifyMomoSignature = (data, signature) => {
    const { accessKey, secretKey, redirectUrl, ipnUrl } = momoConfig;
    const { amount, extraData, orderId, orderInfo, partnerCode, requestId } = data;

    const rawSignature = `accessKey=${accessKey}&amount=${Number(amount)}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=payWithMethod`;

    const computedSignature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log(computedSignature, signature);
    return computedSignature === signature;
};

module.exports = { createPayment, verifyMomoSignature };
