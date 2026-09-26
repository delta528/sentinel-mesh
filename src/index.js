// src/index.js

const config = require('./config/env');
const TelemetryEngine = require('./engine/telemetry');

console.log('----------------------------------------------------');
console.log(`📡 Initializing SentinelMesh Node: [${config.NODE_ID}]`);
console.log(`📍 Location: ${config.LOCATION}`);
console.log(`🔒 Security Protocol: ${config.SECURITY_PROTOCOL}`);
console.log(`⚡ Node Status: ${config.STATUS}`);
console.log('----------------------------------------------------');

const engine = new TelemetryEngine();

// Simulate reading sensor telemetry data

const mockSensorData = { temperature: 23.4, pressure: 1013.25, humidity: 45.2 };
const signedPackage = engine.signPayload(mockSensorData);

console.log('\n📦 Generated Telemetry Package:');
console.log(JSON.stringify(signedPackage, null, 2));

const isValid = engine.verifyPayload(signedPackage);
console.log(`\n🔑 HMAC Signature Verification: ${isValid ? 'PASSED (200 OK)' : 'FAILED (403 Forbidden)'}`);
