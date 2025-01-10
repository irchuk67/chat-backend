const axios = require('axios');

const baseURL = 'https://api.adviceslip.com';
const AdviceApi = axios.create({
    baseURL
});

async function getAdvice() {
    const response = await AdviceApi.get('/advice');
    return response.data;
}

module.exports = {getAdvice}
