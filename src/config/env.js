// src/config/env.js

const path = require('path');
const dotenv = require('dotenv');

// Explicitly load configuration from node_config.env file

const result = dotenv.config({ path: path.resolve(__dirname, '../../node_config.env') });

if (result.error) {
    console.error('❌ Failed to load node_config.env:', result.error.message);
    process.exit(1);
}

// Export validated configurations constants 

module.exports = {
    NODE_ID: process.env.NODE_ID || 'Unknown-node',
    NODE_LOCATION: process.env.NODE_LOCATION || 'unassigned',
    SECURITY_PROTOCOL: process.env.SECURITY_PROTOCOL || 'HMAC-SHA256',
    STATUS: process.env.STATUS || 'INACTIVE',
    PORT: process.env.PORT || 3000,
    INITIALIZED_BY: process.env.INITIALIZED_BY
};