// test_client.js
const crypto = require('crypto');

// Configuration
const SERVER_URL = 'http://localhost:3000';
// Uses the exact fallback secret configured in src/config/env.js
const SHARED_SECRET = process.env.TELEMETRY_SECRET || 'sentinel-mesh-secret-key-2026';

/**
 * Computes an HMAC-SHA256 signature for a payload object.
 * @param {object} payload - Telemetry payload object.
 * @param {string} secret - Shared secret key.
 * @returns {string} Hexadecimal signature.
 */
function generateSignature(payload, secret) {
    const payloadString = JSON.stringify(payload);
    return crypto.createHmac('sha256', secret).update(payloadString).digest('hex');
}

/**
 * Transmits telemetry package envelope to the SentinelMesh ingestion server.
 * @param {string} testName - Description of test case.
 * @param {object} telemetryPayload - The telemetry metric payload.
 * @param {boolean} tamperPayload - If true, alters values after signature calculation to test verification failure.
 */
async function sendTelemetry(testName, telemetryPayload, tamperPayload = false) {
    console.log(`\n==================================================`);
    console.log(`🧪 RUNNING TEST: ${testName}`);
    console.log(`==================================================`);

    // 1. Calculate signature based on untampered payload
    const validSignature = generateSignature(telemetryPayload, SHARED_SECRET);

    // 2. Prepare payload (tamper metrics if requested)
    let payloadToSend = telemetryPayload;
    if (tamperPayload) {
        console.log('⚠️ [TAMPERING] Modifying payload data AFTER generating signature...');
        payloadToSend = {
            nodeId: telemetryPayload.nodeId,
            timestamp: telemetryPayload.timestamp,
            metrics: {
                cpuUsagePercent: telemetryPayload.metrics.cpuUsagePercent,
                memoryFreeBytes: telemetryPayload.metrics.memoryFreeBytes,
                temperature: 999.9, // Altered value!
                networkLatencyMs: telemetryPayload.metrics.networkLatencyMs
            }
        };
    }

    // 3. Construct expected envelope
    const envelope = {
        payload: payloadToSend,
        signature: validSignature
    };

    console.log('📤 Transmitting Envelope:\n', JSON.stringify(envelope, null, 2));

    try {
        const response = await fetch(`${SERVER_URL}/api/v1/telemetry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Node-Id': telemetryPayload.nodeId
            },
            body: JSON.stringify(envelope)
        });

        const responseData = await response.json();
        console.log(`\n📥 Server Response [${response.status} ${response.statusText}]:`);
        console.log(responseData);
    } catch (error) {
        console.error('❌ Request failed:', error.message);
    }
}

/**
 * Main execution runner
 */
async function runTestSuite() {
    console.log('🚀 Starting SentinelMesh Automated Telemetry Client...\n');

    // Sample payload matching server schema
    const sampleTelemetry = {
        nodeId: 'edge-node-alpha-01',
        timestamp: new Date().toISOString(),
        metrics: {
            cpuUsagePercent: 42.5,
            memoryFreeBytes: 1073741824,
            temperature: 36.8,
            networkLatencyMs: 12
        }
    };

    // Test 1: Valid Package
    await sendTelemetry('Valid Telemetry Package', sampleTelemetry, false);

    // Test 2: Tampered Package
    await sendTelemetry('Tampered Telemetry Package', sampleTelemetry, true);

    console.log(`\n==================================================`);
    console.log('🏁 Test Suite Complete');
    console.log(`==================================================\n`);
}

runTestSuite();