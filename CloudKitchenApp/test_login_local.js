
const axios = require('axios');

const LOGIN_URL = 'http://127.0.0.1:8000/api/v1/login';

const credentials = {
    email: 'kdkuldeeptiwari26@gmail.com',
    password: '123456789'
};

console.log(`Attempting login to: ${LOGIN_URL}`);
console.log(`User: ${credentials.email}`);

axios.post(LOGIN_URL, credentials)
    .then(response => {
        console.log('✅ Login Successful!');
        console.log('Status:', response.status);
        console.log('Token:', response.data.token ? 'Received' : 'Missing');
        console.log('User ID:', response.data.user ? response.data.user.id : 'Missing');
    })
    .catch(error => {
        console.log('❌ Login Failed');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else if (error.request) {
            console.log('No response received (Network Error)');
            console.log('Error:', error.message);
        } else {
            console.log('Error:', error.message);
        }
    });
