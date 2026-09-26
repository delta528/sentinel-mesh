// src/engine/telemetry.js

const crypto = require('crypto');
const config = require('../config/env');

class TelemetryEngine {
    constructor(secretKey = 'sentinel-mesh-default-secret') {
        this.secretKey = secretKey;
        this.nodeId = config.NODE_ID;
    }

    /** Signs outgoing payload with HMAC SHA-256 for zero-trust verification */

    signPayload(data) {
        const payloadString = JSON.stringify(data);
        const hmac = crypto.createHmac('sha256', this.secretKey)
                           .update(payloadString)
                           .digest('hex');
        
        return {
            nodeId: this.nodeId,
            timestamp: new Date().toISOString(),
            signature: hmac,
            payload: data
        };
    }

    /** Verifies incoming payload integrity and signature */

    verifyPayload(signedPackage) {
        const { payload, signature } = signedPackage;
        const expectedHmac = crypto.createHmac('sha256', this.secretKey)
                                   .update(JSON.stringify(payload))
                                   .digest('hex');

        // Timing-safe comparison to prevent timing side-channel attacks
        
        return crypto.timingSafeEqual(
            Buffer.from(signature, 'hex'),
            Buffer.from(expectedHmac, 'hex')
        );
    }
}

module.exports = TelemetryEngine;

