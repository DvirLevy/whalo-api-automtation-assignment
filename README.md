Overview

This project implements an end-to-end automated API test for the Fish of Fortune backend API wheel spin flow.
The goal of the test is to verify that the backend correctly:

The implementation uses:
Node.js
Playwright for API automation
Postman collection for API
Newman to run the Postman collection from CLI

Project Structure
 ├─ APIs
 │   ├─ Login.ts
 │   └─ WheelSpin.ts
 │  
 ├─ infrastructure
 │   ├─APIHandlers
 │   │   ├─ APIRequest.ts
 │   │   └─ Headers.ts  
 │   │
 │   ├─ fixtures
 │   │   └─ fixtures.ts
 │   ├─ state
 |   │   ├─ Snapshot.types.ts
 │   │   ├─ StateContext.ts
 │   │   └─ Snapshot.types.ts
 │   ├─ testData.ts
 │   └─ Utils.ts
 │
 ├─ validators
 │   ├─ validateLogin.ts
 │   └─ validateWheelSpin.ts
 │
tests
 │
postman

Prerequisites
Make sure the following tools are installed:
Node.js (v18+ recommended)

#Project Setup
- git clone <repository-url>
- cd whalo-assignment
- create .env.prod with the HOST sent by the email
- run: npm i
- run the test with -> "npm run prod"
- see report with -> "npm run report"

#Postman collection runner
- run with the following -> "npm run postman"
