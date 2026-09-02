const crypto = require('crypto');

async function testPhonePe() {
  const payload = {
    merchantId: 'PGTESTPAYUAT86',
    merchantTransactionId: 'TEST_' + Date.now(),
    merchantUserId: 'USER123',
    amount: 10000,
    redirectUrl: 'http://localhost:3000/shop/order-success?paymentId=test',
    redirectMode: 'REDIRECT',
    callbackUrl: 'http://localhost:5000/api/payments/callback',
    paymentInstrument: {
      type: 'PAY_PAGE'
    }
  };

  const saltKey = '96434309-7796-489d-8924-ab56988a6076';
  const saltIndex = '1';

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const dataToHash = base64Payload + '/pg/v1/pay' + saltKey;
  const checksum = crypto.createHash('sha256').update(dataToHash).digest('hex') + '###' + saltIndex;

  const phonePeUrl = 'https://api-preprod.phonepe.com/apis/hermes/pg/v1/pay';

  try {
    const response = await fetch(phonePeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const responseData = await response.json();
    console.log(JSON.stringify(responseData, null, 2));
  } catch (error) {
    console.error(error);
  }
}

testPhonePe();
