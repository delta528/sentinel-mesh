# SentinelMesh: Zero-Trust Edge Telemetry Engine

SentinelMesh is a real-time, zero-trust telemetry processing platform designed to ingest, cryptographically verify, and visualize high-frequency edge device data.

---

## Features

- **Zero-Trust Verification:** Inbound edge payloads are validated using HMAC cryptographic signatures.
- **Real-Time Streaming:** Bi-directional telemetry transmission powered by WebSockets.
- **Automated CI/CD Pipeline:** Multi-stage GitHub Actions workflows covering linting, testing, Docker builds, and deployment verification.

---

## Architecture Overview

```mermaid
graph TD
    Edge[IoT / Edge Device] -->|Signed Data Payload| Engine[Telemetry Processing Engine<br/>Node.js]
    Engine -->|HMAC Verified Stream| Dash[Dashboard UI<br/>React]
    Engine -->|Persist Logs| DB[(Telemetry Store<br/>MongoDB)]

    subgraph GitHub Actions CI/CD Pipeline
        CI1[1. Lint & Test] --> CI2[2. Build Bundle]
        CI2 --> CI3[3. Package Docker Image]
        CI3 --> CI4[4. Deploy Staging]
        CI4 --> CI5[5. Deploy Production]
    end
```
---

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/delta528/sentinel-mesh.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run tests:
   ```bash
   npm test
   ```



