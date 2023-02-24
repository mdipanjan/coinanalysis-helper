require("dotenv").config();
const axios = require("axios");

// Create an instance of Axios with custom configuration options
const api = axios.create({
  baseURL: "https://pro-api.coinmarketcap.com/v1",
  headers: {
    "Content-Type": "application/json",
    "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API,
    // 'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
});

// Add an interceptor to the Axios instance to handle error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Handle unauthorized error
      // Redirect to login page or refresh token
    } else {
      return Promise.reject(error);
    }
  }
);

module.exports = {
  api,
};
