// src/config/env.js
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from node_config.env in the root directory
dotenv.config({ path: path.resolve(process.cwd(), 'node_config.env') });

module.exports = {
    NODE_ID: process.env.NODE_ID || 'Unknown-node',
    LOCATION: process.env.NODE_LOCATION || 'unassigned',
    SECURITY_PROTOCOL: process.env.SECURITY_PROTOCOL || 'HMAC-SHA256',
    STATUS: process.env.STATUS || 'INACTIVE',
    PORT: process.env.PORT || 3000,
    INITIALIZED_BY: process.env.INITIALIZED_BY || 'system-admin',
    TELEMETRY_SECRET: process.env.TELEMETRY_SECRET || 'sentinel-mesh-secret-key-2026'
};