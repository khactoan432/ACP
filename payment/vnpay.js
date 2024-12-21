const crypto = require('crypto');
const querystring = require('querystring');
const moment = require('moment');

const vnpayConfig = {
    "vnp_TmnCode":"F1FYH5TW",
    "vnp_HashSecret":"EO1AIHNWR5AI7Z6R2A7OF018FLVMGDHL",
    "vnp_Url":"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    "vnp_Api":"https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
    "vnp_ReturnUrl": "http://localhost:5050/api/payment/vnpay-return"
};

// Hàm tạo URL thanh toán VNPay
const createPaymentUrl = ({ amount, bankCode }) => {
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    
    let tmnCode = vnpayConfig.vnp_TmnCode;
    let secretKey = vnpayConfig.vnp_HashSecret;
    let vnpUrl = vnpayConfig.vnp_Url;
    let returnUrl = vnpayConfig.vnp_ReturnUrl;
    let orderId = moment(date).format('DDHHmmss');
    
    let locale = 'vn';
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
};

// Hàm xác minh chữ ký (VNPay Return URL)
const verifyVnpaySignature = (params) => {
    const secureHash = params['vnp_SecureHash'];
    delete params['vnp_SecureHash'];
    delete params['vnp_SecureHashType'];

    const sortedParams = Object.keys(params)
        .sort()
        .reduce((acc, key) => {
            acc[key] = params[key];
            return acc;
        }, {});

    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha256', vnpayConfig.secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return secureHash === signed;
};

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = { createPaymentUrl, verifyVnpaySignature };
