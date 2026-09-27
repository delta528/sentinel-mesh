// src/server.js
const express = require('express');
const crypto = require('crypto');
const config = require('./config/env');

const app = express();
app.use(express.json());

// 1. Health Endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ONLINE',
        nodeId: config.NODE_ID,
        location: config.LOCATION,
        initializedBy: config.INITIALIZED_BY,
        timestamp: new Date().toISOString()
    });
});

// 2. Telemetry Ingestion Endpoint
app.post('/api/v1/telemetry', (req, res) => {
    const { payload, signature } = req.body;

    if (!payload || !signature) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Malformed package. Required fields: payload, signature.'
        });
    }

    const payloadString = JSON.stringify(payload);
    const expectedSignature = crypto
        .createHmac('sha256', config.TELEMETRY_SECRET)
        .update(payloadString)
        .digest('hex');

    console.log('\n--- Ingestion Verification ---');
    console.log('Received Signature:', signature);
    console.log('Expected Signature:', expectedSignature);

    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
        return res.status(403).json({
            error: 'Forbidden',
            message: 'HMAC signature verification failed. Payload untrusted.'
        });
    }

    return res.status(200).json({
        status: 'SUCCESS',
        message: 'Telemetry data ingested successfully.',
        nodeId: payload.nodeId
    });
});

// 3. Start Server Listener (REQUIRED)
app.listen(config.PORT, () => {
    console.log(`🚀 SentinelMesh Ingestion Server running on http://localhost:${config.PORT}`);
});