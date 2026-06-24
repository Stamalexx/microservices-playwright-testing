# Microservices End-to-End Testing Suite (Playwright)

**Author:** Alexios Stamelos

[![Academic Thesis](https://img.shields.io/badge/Read-Full_Academic_Thesis-blue.svg)](https://github.com/Stamalexx/MSc-Thesis-GitOps-Microservices.git)

## Overview
This repository contains the automated End-to-End (E2E) testing framework for the Google Online Boutique microservices application. Built using Microsoft Playwright (Node.js/TypeScript), this suite acts as the definitive "Shift-Left" Quality Gate within the GitOps continuous integration pipeline.

By executing these tests against an isolated, ephemeral replica of the application before deployment, the architecture proactively intercepts UI regressions and complex inter-service dependency failures, physically insulating the production cluster from defective code.

## Role in the CI/CD Pipeline
This testing suite is dynamically invoked by the Jenkins CI server during the integration phase. The execution flow is as follows:

1. **Ephemeral Provisioning:** Jenkins spins up a complete, localized replica of the microservices topology using `docker-compose`.
2. **Containerized Execution:** This repository is cloned into a stateless Playwright Docker container (`mcr.microsoft.com/playwright`).
3. **Headless Validation:** Playwright executes cross-browser, headless smoke tests directly against the ephemeral frontend. 
4. **Pipeline Interception (The Quality Gate):** * **Pass (Exit Code 0):** The pipeline is authorized to push the new Docker images and update the declarative GitOps repository.
   * **Fail (Non-zero Exit Code):** The pipeline is immediately terminated. The GitOps repository is not updated, ensuring the defective code never reaches the Argo CD continuous delivery phase.

## Testing Strategy & Coverage
The tests in this repository are designed to simulate authentic user workflows and validate the holistic runtime behavior of the microservices ecosystem. Key validation areas include:

* **Frontend Regression Detection:** Verifying the presence and functionality of critical DOM elements (e.g., product rendering, cart interactions, and checkout buttons) to prevent cosmetic and functional UI bugs.
* **Inter-Service Dependency Validation:** Ensuring that synchronous backend communications (such as the frontend communicating with the `currencyservice` or `cartservice`) are functioning correctly under load. This proves that simple container compilation is insufficient, as Playwright catches the cascading communication failures that traditional CI pipelines miss.
* **Test Idempotency:** Utilizing pre-test setup hooks to programmatically clear residual transactional data, ensuring that tests remain highly deterministic and free from environmental pollution.

## Local Execution
To run these tests locally against a running instance of the application:

```bash
# Install dependencies
npm install

# Run the Playwright test suite
npx playwright test
