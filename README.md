# CloudSage

## Context-Aware AI Cloud Resource Cost, Performance and Reliability Decision Advisor

CloudSage is an AI-assisted cloud resource decision advisor that analyzes resource telemetry, cost observations, performance indicators, reliability signals, historical observations, and decision constraints to generate evidence-based infrastructure recommendations.

The system combines a deterministic decision engine with an AI explanation layer. The decision engine evaluates measurable resource behavior and produces the recommendation, while the AI layer converts the analytical evidence into a clear human-readable explanation.

---

## Project Overview

Cloud environments generate large amounts of operational data such as CPU utilization, memory usage, network activity, request volume, latency, error rate, and resource cost.

Simply monitoring these metrics does not directly answer an important operational question:

> **What should be done about the current resource condition?**

CloudSage addresses this decision-support problem by analyzing available resource observations and converting them into actionable recommendations.

The system considers:

- Resource performance
- Resource reliability
- Observed cost
- Historical telemetry
- Data quality
- Evidence supporting the decision
- Decision constraints
- AI-assisted explanation

Instead of allowing an AI model to independently determine infrastructure actions, CloudSage uses a deterministic analysis engine as the decision authority and uses AI to explain the resulting evidence-based decision.

---

## Problem Statement

Cloud resource environments can become difficult to manage when performance, reliability, and cost must be evaluated together.

A resource may have:

- Increasing CPU utilization
- Increasing memory pressure
- High request latency
- Increasing error rates
- Growing operational cost

Looking at each metric independently can make it difficult to determine whether the resource requires intervention.

CloudSage provides a unified decision-support approach that evaluates these signals together and produces a recommendation supported by measurable evidence.

---

## Solution

CloudSage follows an evidence-driven analysis workflow:

```text
Resource Telemetry
       │
       ▼
Historical Observation
       │
       ▼
Data Quality Assessment
       │
       ▼
Performance & Reliability Analysis
       │
       ▼
Deterministic Decision Engine
       │
       ▼
Decision + Recommendation
       │
       ▼
Supporting Evidence
       │
       ▼
AI Explanation
       │
       ▼
Human-Readable Decision
```

The system separates **decision generation** from **decision explanation**.

This ensures that the AI explanation is grounded in analytical evidence instead of allowing the language model to independently invent infrastructure recommendations.

---

## Key Features

### 1. Resource Inventory

CloudSage maintains information about monitored cloud resources, including:

- Resource name
- Resource type
- Cloud provider
- Region
- Current status

Example resources include EC2 and RDS resources.

### 2. Resource Telemetry Analysis

The system analyzes operational measurements such as:

- CPU utilization
- Memory utilization
- Network utilization
- Request count
- Average latency
- Error rate
- Recorded timestamp

Historical observations are used to identify performance and reliability pressure.

### 3. Cost Analysis

CloudSage analyzes recorded resource cost information and provides:

- Total observed cost
- Number of cost records
- Average recorded cost
- Resource-level cost distribution
- Cost interpretation

The system clearly distinguishes observed cost data from verified cloud billing or savings.

### 4. Evidence-Based Decisions

Every generated recommendation is supported by measurable evidence.

Examples include:

- CPU peak
- Memory peak
- Average latency
- Error rate

Each evidence item contains:

- Metric category
- Metric name
- Observed value
- Unit
- Interpretation
- Data-quality classification

### 5. Deterministic Decision Engine

The decision engine evaluates resource history using defined analytical thresholds.

Depending on the available evidence, CloudSage can produce decisions such as:

- `REVIEW_RESOURCE`
- `NO_ACTION`
- `DO_NOT_RECOMMEND`

The decision engine also assigns a severity and confidence/data-quality level.

### 6. Data Quality Awareness

CloudSage does not treat every dataset as equally reliable.

The system classifies analytical evidence using:

- `SUFFICIENT`
- `LIMITED`
- `INSUFFICIENT`
- `STALE`
- `INVALID`

When insufficient historical information is available, the system avoids making an unsupported infrastructure recommendation.

### 7. AI-Assisted Explanation

The AI layer converts analytical results into human-readable explanations.

The AI explanation is based on:

- Generated decision
- Recommendation
- Reason
- Evidence
- Data quality

The AI layer is therefore used as an explanation and communication component rather than as an unrestricted infrastructure control mechanism.

### 8. Decision Center

The Decision Center presents:

- Resource decisions
- Recommendations
- Reasons
- Confidence
- Supporting evidence
- Data quality
- Human review state

This provides a centralized view of resource-level decisions.

### 9. Scenario Simulation

CloudSage includes a simulation interface for evaluating changes in resource cost assumptions and observing their effect on projected cost calculations.

### 10. Decision Outcomes

CloudSage provides a structure for recording decision outcomes such as:

- Approval status
- Actual action
- Actual cost
- Actual performance score
- Actual reliability score
- Outcome status
- Notes
- Recorded timestamp

This allows decisions to be associated with their observed outcomes.

---

## System Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ React + Vite        │
                    │ CloudSage Frontend  │
                    └──────────┬──────────┘
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │ Spring Boot Backend │
                    │ Java 21             │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
 ┌────────────────┐   ┌─────────────────┐   ┌────────────────┐
 │ PostgreSQL     │   │ Decision Engine │   │ AI Explanation │
 │ Database       │   │                 │   │ Spring AI      │
 └────────────────┘   └─────────────────┘   └───────┬────────┘
                                                     │
                                                     ▼
                                               ┌─────────────┐
                                               │ Ollama      │
                                               │ LLM         │
                                               └─────────────┘
```

---

## Decision-Making Workflow

CloudSage follows these major stages:

### Stage 1 — Resource Data

Resource information and historical telemetry are stored in PostgreSQL.

### Stage 2 — Metric Analysis

The backend calculates analytical values such as:

- Average CPU utilization
- Peak CPU utilization
- Average memory utilization
- Peak memory utilization
- Average network utilization
- Peak network utilization
- Average request count
- Peak request count
- Average latency
- Peak latency
- Average error rate
- Peak error rate

### Stage 3 — Data Quality

The available historical evidence is evaluated before a recommendation is generated.

For example, insufficient historical records result in a lower-confidence analytical state rather than an unsupported recommendation.

### Stage 4 — Decision Generation

The deterministic decision engine evaluates the calculated metrics against configured thresholds.

For example:

```text
CPU Peak > Threshold
        │
        ▼
Performance Pressure Detected
        │
        ▼
Resource Review Required
```

### Stage 5 — Evidence Generation

The system records the metrics responsible for the decision.

### Stage 6 — AI Explanation

The AI layer receives the analytical result and produces a human-readable explanation grounded in the available evidence.

---

## Decision Engine

The decision engine currently evaluates important resource conditions including:

| Metric | Attention Threshold |
|---|---:|
| CPU Utilization | 80% |
| Memory Utilization | 80% |
| Average Latency | 200 ms |
| Error Rate | 2% |
| Minimum Historical Records | 10 |

These thresholds are used as analytical decision signals rather than as universal cloud-provider limits.

### Example

If a resource contains sufficient historical observations and shows elevated performance or reliability pressure:

```text
Decision:
REVIEW_RESOURCE

Recommendation:
Review resource capacity and workload behavior

Severity:
WARNING

Confidence:
SUFFICIENT
```

The recommendation is accompanied by the specific evidence that contributed to the decision.

---

## Data Quality and Evidence

A major feature of CloudSage is that recommendations are connected to evidence.

For example:

```text
Category:
Performance

Metric:
CPU Peak

Value:
86%

Interpretation:
Peak CPU utilization indicates elevated resource pressure.

Data Quality:
SUFFICIENT
```

Multiple evidence items can be combined to support a single resource decision.

This makes the recommendation traceable rather than presenting an unexplained AI-generated answer.

---

## AI Explanation Layer

CloudSage uses Spring AI with an Ollama-based local language model during development.

The AI layer receives structured analytical information such as:

```text
Decision
Recommendation
Reason
Severity
Confidence
Evidence
Data Quality
```

The AI then converts the result into a natural-language explanation.

The architecture intentionally separates:

```text
Decision Logic
      │
      ▼
Deterministic Analysis
      │
      ▼
Evidence
      │
      ▼
AI Explanation
```

This improves traceability and reduces the risk of allowing a language model to independently invent infrastructure decisions.

---

## Technology Stack

### Backend

- Java 21
- Spring Boot 3.4.5
- Spring Web
- Spring Data JPA
- Hibernate
- Maven
- REST APIs

### Frontend

- React
- JavaScript
- JSX
- Vite
- CSS

### Database

- PostgreSQL 17

### AI

- Spring AI
- Ollama
- Qwen 2.5 1.5B

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Apache Maven
- PostgreSQL

---

## Database Design

CloudSage uses PostgreSQL for persistent resource, telemetry, cost, recommendation, and decision-outcome information.

### CloudResource

Stores cloud resource information.

Main attributes include:

- ID
- Resource name
- Resource type
- Provider
- Region
- Status

### ResourceMetric

Stores resource telemetry.

Main attributes include:

- CPU utilization
- Memory utilization
- Memory used
- Network utilization
- Request count
- Average latency
- Error rate
- Recorded timestamp
- Associated cloud resource

### CostRecord

Stores recorded cost observations.

Main attributes include:

- Amount
- Currency
- Billing period
- Cost type
- Recorded timestamp
- Associated resource

### Recommendation

Stores generated resource recommendations.

Main attributes include:

- Recommended action
- Reason
- Estimated cost
- Estimated performance score
- Estimated reliability score
- Risk level
- Creation timestamp
- Associated resource

### RecommendationOutcome

Stores observed outcomes associated with recommendations.

Main attributes include:

- Approval status
- Actual action
- Actual cost
- Actual performance score
- Actual reliability score
- Outcome status
- Notes
- Recorded timestamp

### DecisionConstraint

Represents decision-context constraints such as:

- Maximum budget
- Minimum performance score
- Minimum reliability score
- Workload priority
- Service-level requirement

---

## Project Structure

```text
CloudSage/
│
├── dataset/
│   └── Historical resource datasets
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── src/
│   ├── main/
│   │   ├── java/com/cloudsage/
│   │   │   ├── ai/
│   │   │   ├── analysis/
│   │   │   ├── common/
│   │   │   ├── config/
│   │   │   ├── constraint/
│   │   │   ├── cost/
│   │   │   ├── data/
│   │   │   ├── decision/
│   │   │   ├── recommendation/
│   │   │   ├── resource/
│   │   │   └── system/
│   │   └── resources/
│   │       └── application.properties
│   │
│   └── test/
│
├── .gitignore
├── pom.xml
└── README.md
```

---

## Main Backend Modules

### `resource`

Responsible for:

- Cloud resource management
- Resource telemetry
- Resource repositories
- Resource REST APIs

### `cost`

Responsible for:

- Cost records
- Cost persistence
- Cost APIs

### `analysis`

Responsible for:

- Resource-level analysis
- Metric aggregation
- Decision analysis API

### `decision`

Responsible for:

- Decision engine
- Evidence generation
- Data-quality classification
- Decision results

### `recommendation`

Responsible for:

- Recommendation persistence
- Recommendation outcome information

### `ai`

Responsible for:

- AI explanation requests
- Spring AI integration
- LLM interaction

### `data`

Responsible for:

- Historical dataset processing
- Resource telemetry loading
- Data preparation

---

## API Overview

The backend exposes REST endpoints for the main CloudSage operations.

### System

```text
GET /api/system/health
```

Used to verify backend availability.

### Resources

```text
GET /api/resources
```

Retrieves available cloud resources.

### Resource Metrics

```text
GET /api/resource-metrics
```

Retrieves resource telemetry.

### Cost Records

```text
GET /api/cost-records
```

Retrieves recorded resource cost information.

### Resource Analysis

```text
GET /api/resource-analysis/{resourceId}
```

Performs resource-level analytical evaluation.

### Historical Dataset

Historical resource observations can be loaded through the backend data-processing functionality.

### AI

The AI controller provides the AI explanation layer using the analytical decision information.

---

## Local Setup

### Prerequisites

Install the following:

- Java 21
- Maven
- Node.js
- npm
- PostgreSQL 17
- Ollama

Verify Java:

```bash
java -version
```

Verify Maven:

```bash
mvn -version
```

Verify Node.js:

```bash
node -v
```

Verify npm:

```bash
npm -v
```

---

## Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE cloudsage_db;
```

Configure the PostgreSQL connection through environment variables.

Example:

```text
DB_URL=jdbc:postgresql://localhost:5432/cloudsage_db
DB_USERNAME=postgres
DB_PASSWORD=your_database_password
```

The actual password must not be committed to Git.

---

## AI Setup

CloudSage uses Ollama for local AI execution.

Start Ollama and make the required model available:

```bash
ollama pull qwen2.5:1.5b
```

The application uses:

```text
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:1.5b
OLLAMA_TEMPERATURE=0.2
```

---

## Backend Configuration

The backend reads environment variables for environment-specific configuration.

Important variables include:

```text
PORT
DB_URL
DB_USERNAME
DB_PASSWORD
SHOW_SQL
FORMAT_SQL
OLLAMA_BASE_URL
OLLAMA_MODEL
OLLAMA_TEMPERATURE
CPU_DATASET_PATH
MEMORY_DATASET_PATH
```

The application uses project-relative dataset paths by default.

Example:

```text
./dataset/Experiment_3/CPU/...
./dataset/Experiment_3/RAM/...
```

---

## Run the Backend

From the project root:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

The health endpoint can be checked using:

```text
http://localhost:8080/api/system/health
```

---

## Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will provide the frontend URL in the terminal.

The frontend uses:

```text
VITE_API_BASE_URL
```

to connect to the Spring Boot backend.

Example:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Build the Frontend

To create a production frontend build:

```bash
npm run build
```

The generated production files are placed in:

```text
frontend/dist/
```

The `dist/` directory is excluded from Git because it is generated build output.

---

## Data Handling

CloudSage uses historical resource observations for analytical evaluation.

The project dataset contains CPU and memory observations collected from cloud-related experimental environments.

The system also supports structured resource telemetry containing metrics such as:

- CPU
- Memory
- Network
- Requests
- Latency
- Error rate

When certain metrics are unavailable in a historical dataset, CloudSage does not fabricate those measurements. The available evidence is reflected through the data-quality mechanism.

---

## Example Analytical Result

For a resource with sufficient historical observations, CloudSage may identify:

```text
CPU Peak:
86%

Memory Peak:
78%

Average Latency:
184 ms

Error Rate:
1.37%

Decision:
REVIEW_RESOURCE

Severity:
WARNING

Confidence:
SUFFICIENT
```

The decision is then presented together with the supporting evidence and recommendation.

---

## Cost Analysis

CloudSage analyzes recorded cost observations rather than claiming direct access to live cloud billing systems.

The cost analysis provides:

- Total observed cost
- Resource-level cost
- Average recorded cost
- Number of cost records
- Cost distribution

This keeps cost analysis traceable to the data available to the system.

---

## Validation and Testing

CloudSage validates the major system layers through:

- Spring Boot application testing
- Backend health verification
- PostgreSQL connectivity
- REST API validation
- Resource telemetry analysis
- Decision engine evaluation
- Data-quality handling
- Frontend production build validation
- Backend-to-frontend API connectivity

The frontend production build is generated successfully using Vite.

The backend is built using Maven and Java 21.

---

## Security Considerations

CloudSage follows secure configuration practices including:

- Database passwords are supplied through environment variables.
- Frontend environment files containing local configuration are excluded from Git.
- API credentials are not stored in frontend source code.
- Production configuration is separated from development configuration.
- Local development configuration uses environment-variable defaults.
- Generated build directories are excluded from source control.

Sensitive configuration should always be supplied through environment variables rather than committed to the repository.

---

## Project Outcome

CloudSage provides a structured decision-support approach for cloud resource management by combining:

```text
Cloud Resource Data
        +
Historical Observations
        +
Cost Information
        +
Performance Metrics
        +
Reliability Signals
        +
Data Quality
        +
Deterministic Decision Logic
        +
AI Explanation
        =
Evidence-Based Resource Decision
```

The resulting system provides a traceable way to move from raw cloud resource observations to understandable infrastructure recommendations.

---

## Conclusion

CloudSage demonstrates how cloud resource analysis, deterministic decision logic, evidence management, and generative AI can be combined into a practical decision-support system.

The key design principle is that **AI explains the analytical decision rather than replacing the analytical decision process**.

This approach improves transparency, traceability, and reliability when using AI in cloud infrastructure decision support.

---

## Project Information

**Project Name:** CloudSage

**Formal Title:** Context-Aware AI Cloud Resource Cost, Performance and Reliability Decision Advisor

**Primary Technologies:** Java, Spring Boot, React, PostgreSQL, Spring AI, Ollama

**Development Approach:** Full-stack application with evidence-based decision analysis and AI-assisted explanation
