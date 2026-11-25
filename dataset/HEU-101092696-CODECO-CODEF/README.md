# HEU-101092696-CODECO-CODEF-Resources — README

## Overview

| Field | Value |
|---|---|
| **Dataset Name** | CODEF Dynamic Cloud–Edge Resource Demand Dataset from Kubernetes Experiments and Stress Testing |
| **Dataset Unique ID** | HEU-101092696-CODECO-CODEF-Resources |
| **Project** | CODECO — COgnitive DECentralized Orchestration |
| **Grant Agreement Number** | 101092696 |
| **Topic** | HORIZON-CL4-2022-DATA-01 |
| **Related WP / Task** | WP5 |
| **Version** | 1.0 |
| **Release Date** | 2026-03-09 |
| **License** | Creative Commons Attribution 4.0 International (CC BY 4.0) |

---

## Dataset Description

This dataset contains real-world worker-level CPU and memory utilisation time-series collected from controlled cloud–edge experiments on Kubernetes-based infrastructures. The data were generated using the **CODEF experimentation framework** across multiple Kubernetes distributions (**Vanilla Kubernetes**, **K3s**) and Container Network Interfaces (**Flannel**, **Calico**) under dynamic and heterogeneous workload conditions.

Each time series captures the resource usage (CPU and memory) of a worker node executing benchmarking experiments. The experiments include pod-scaling scenarios, compute-intensive workloads generated with [**stress-ng**](https://github.com/ColinIanKing/stress-ng) and the CNCF [**kube-burner**](https://kube-burner.github.io/kube-burner/) tool, and multi-phase workload transitions, reflecting realistic, fluctuating service loads of benchmarking microservices. The dataset is designed to incorporate heterogeneity across software stacks and workload mixes, reflecting variability rather than a single homogeneous setup.

Metrics are sampled every **30 seconds** and recorded continuously to evaluate the impact of pod counts and stress levels on resource use. In summary, the dataset comprises a total of **250,432 timestamped samples** spanning **280.23 hours** (~12 days) across three experimental scenarios conducted between May and September 2025.

Three distinct benchmark scenarios are included:

- **Experiment I — Mixed Workload:** A batch of 1–100 application pods is launched to measure creation-to-readiness latency at several K8s-cluster scales. In parallel, controlled CPU pressure is generated with stress-ng and kube-burner, while the stress-pod count, target CPU utilisation (in MB), and experiment duration are varied across different ranges.
- **Experiment II — Two-Stage Mixed Workload:** The procedure of Experiment I is repeated but divided into two distinct phases: the first half reproduces the original workload unchanged, while the second half increases/decreases the pod count and adjusts the stress parameters. This mid-run shift produces a contrasting load pattern that tests the models' ability to adapt and detect workload transitions.
- **Experiment III — Dynamic Workload Profiles:** Three workload profiles with realistic temporal patterns are introduced across 2 diverse K8s flavors (K8s, K3s) and CNI plugins (Flannel, Calico) to capture experimental tradeoffs of Cloud–Edge infrastructures: **(i) stable-low**, representing lightweight background services (e.g., monitoring, data collectors); **(ii) brief-high**, applying short bursts from interactive queries or request spikes (e.g., web services); and **(iii) long-medium**, reflecting sustained server activity. These scenarios are alternated and repeated by users with pod scaling and stress pods, as in the previous experiments.

---

## Use Cases and Intended Audience

This dataset is primarily intended for:

- Training and evaluating **Machine Learning (ML) algorithms** for cloud–edge resource demand prediction and anomaly detection.
- Benchmarking **resource provisioning** and **auto-scaling** strategies under realistic workload dynamics.
- Research on **ML-driven network and service management** in heterogeneous Kubernetes environments.
- Development of **edge-cloud orchestration** policies under resource constraints.
- Competition and challenge settings evaluating ML approaches for cloud–edge resource management (e.g., resource demand prediction, anomaly detection, service provisioning).

---

## Data Origin and Generation Methodology

- **Origin:** Real-world telemetry data collected from live Kubernetes clusters managed by the CODEF framework.
- **Not based on any pre-existing dataset.**
- **Generation process:**
  1. Kubernetes clusters were provisioned using CODEF across heterogeneous infrastructure nodes (cloud VMs, edge devices including Raspberry Pi).
  2. Two Kubernetes distributions were employed: Vanilla Kubernetes (kubeadm) and K3s (lightweight edge distribution).
  3. Two Container Network Interfaces were configured: Calico and Flannel.
  4. Workloads were generated via pod-scaling experiments (batches of 1–100 application pods) combined with compute-intensive `stress-ng` and `kube-burner` workloads, with varying stress-pod counts, target CPU ranges, and experiment durations.
  5. CPU and memory utilisation metrics were collected from Grafana dashboards connected to the cluster monitoring stack (node-exporter / Prometheus) and exported as CSV files at 5-second intervals.
  6. Each experiment was repeated multiple times to capture variability across runs.

---

## File Structure

```
HEU-101092696-CODECO-CODEF-Resources/
├── README.md
├── Experiment_1/
│   ├── CPU/          # 80 CSV files (pod-scaling, stress-ng, combined workloads)
│   └── RAM/          # 40 CSV files (memory utilisation under same workloads)
├── Experiment_2/
│   ├── CPU/          # 50 CSV files + 1 ML evaluation log (TXT)
│   └── RAM/          # 52 CSV files + 1 ML evaluation log (TXT)
└── Experiment_3/
    ├── CPU/          # 68 CSV files (including joinbyfield breakdown variants)
    └── RAM/          # 68 CSV files (including joinbyfield breakdown variants)
```

---

## Benchmark Scenarios and Key Parameters

The table below summarises the workload configuration for each experiment.

| Scenario | Workloads | Pod-count range | CPU range | Test duration |
|----------|-----------|-----------------|-----------|---------------|
| **Experiment I — Mixed Workload** | (i) Pod-scaling: Native K8s deployment (ii) Compute-stress: stress-ng & kube-burner stress pods and workloads | 1–100 startup pods: [1–20], [10–30], [20–40], [30–60], [40–60]. 1–2 stress pods per workload | (i) Fixed, based on the baseline footprint of the container in every pod (ii) Randomised, based on CPU usage ranges (in MB): [50–250], [150–400], [300–600], [100–900], [600–900] | (i) Dynamic, per-batch pod-readiness (ii) Randomised, based on ranges: [20–100], [60–300], [100–400], [90–500], [180–500] |
| **Experiment II — Two-Stage Mixed Workload** | Execution of Experiment I for the first half of its duration; mid-way, adjust the workload | 1–100 startup pods: [1–20], [10–30], [20–40], [30–60], [40–60]. 2–4 stress pods per workload | (i) Fixed, based on the baseline footprint of the container in every pod (ii) Randomised, based on CPU usage ranges (in MB). Follows Exp. I and after half time transitions to: [400–800], [400–800], [200–500], [300–600], [50–200] | (i) Dynamic, per-batch pod-readiness (ii) Randomised, based on ranges: [60–300], [100–400], [90–500], [180–500] |
| **Experiment III — Dynamic Workload Profiles** | Workloads across diverse K8s flavors/CNIs, focusing on: (i) stable-low, (ii) brief-high, (iii) long-medium | 1–100 startup pods: [1–20], [10–30], [20–40], [30–60], [40–60]. 1–2 stress pods per workload | (i) Fixed, based on the baseline footprint of the container in every pod (ii) Randomised, based on CPU usage ranges (in MB): [50–250], [150–400], [300–600], [600–900] | (i) Dynamic, per-batch pod-readiness (ii) Randomised, based on workloads (i–iii): [20–100], [60–300], [180–500], [300–600] |

---

## Experiment Details

### Experiment 1 — Mixed Workload

| Attribute | Value |
|-----------|-------|
| **Period** | 28 May – 3 June 2025 |
| **Records** | 63,269 |
| **Kubernetes Distribution** | Vanilla Kubernetes (kubeadm) |
| **CNIs** | Calico, Flannel |
| **Sampling Interval** | 5 or 30 seconds |
| **CPU Files** | 80 |
| **RAM Files** | 40 |

**File naming convention:**

`<cni> worker <max_pods> <metric> <stressors> <params> - <run> [- idle].csv`

- `calico worker 100 cpu 2 30 60 - 1.csv` — Calico CNI, up to 100 pods, CPU metric, run 1.
- `calico worker 100 cpu 2 30 60 - 1 - idle.csv` — Corresponding idle CPU percentage.
- `cpu stress ng 50 100 900 - 1.csv` — stress-ng workload with specific stressor parameters, run 1.
- `combined calico worker cpu - 1.csv` — Combined multi-phase workload, run 1.
- `flannel worker 15 cpu 3 30 '<pod_counts>'.csv` — Flannel CNI with variable pod-count sequences.

### Experiment 2 — Two-Stage Mixed Workload

| Attribute | Value |
|-----------|-------|
| **Period** | 18 – 21 June 2025 |
| **Records** | 64,151 |
| **Kubernetes Distribution** | K3s |
| **Sampling Interval** | 5 or 30 seconds |
| **CPU Files** | 50 (+1 TXT) |
| **RAM Files** | 52 (+1 TXT) |

**File naming convention:**

`CPU Basic-data-<YYYY-MM-DD> <HH_MM_SS>.csv` / `Memory Basic-data-<YYYY-MM-DD> <HH_MM_SS>.csv`

Files are Grafana CSV exports with timestamps in the filename. Each file captures a single worker node's metrics over one experiment window.

The accompanying `Case2_touse_CPU.txt` and `Case2_touse_RAM.txt` files contain baseline ML evaluation logs (hyperparameters, per-device R² and RMSE scores) produced during initial model training on this experiment's data.

### Experiment 3 — Dynamic Workload Profiles

| Attribute | Value |
|-----------|-------|
| **Period** | 30 August – 1 September 2025 |
| **Records** | 123,012 |
| **Kubernetes Distributions** | Vanilla Kubernetes, K3s |
| **CNIs** | Calico, Flannel |
| **Sampling Interval** | 5 or 30 seconds |
| **CPU Files** | 68 (60 basic + 8 joinbyfield) |
| **RAM Files** | 68 (60 basic + 8 joinbyfield) |

**File naming convention:**

- `CPU Basic-data-<timestamp>.csv` / `Memory Basic-data-<timestamp>.csv` — Single-metric series (same schema as Experiment 2).
- `CPU Basic-data-as-joinbyfield-<timestamp>.csv` — Detailed CPU breakdown with all utilisation categories.
- `Memory Basic-data-as-joinbyfield-<timestamp>.csv` — Detailed memory breakdown with total, used, cache, free, and swap.

---

## CSV Schemas

### CPU — Basic Format (Experiments 1, 2, 3)

| Column | Type | Unit / Format | Description |
|--------|------|---------------|-------------|
| `Time` | Datetime | `YYYY-MM-DD HH:MM:SS` | Timestamp of the measurement. |
| `Busy User` | String | Percentage (e.g., `22.9%`) | User-space CPU utilisation at the recorded time step. |

### CPU — Idle Format (Experiment 1)

| Column | Type | Unit / Format | Description |
|--------|------|---------------|-------------|
| `Time` | Datetime | `YYYY-MM-DD HH:MM:SS` | Timestamp of the measurement. |
| `Idle` | String | Percentage (e.g., `96.9%`) | CPU idle percentage at the recorded time step. |

### CPU — Joinbyfield Breakdown (Experiment 3)

| Column | Type | Unit / Format | Description |
|--------|------|---------------|-------------|
| `Time` | Datetime | `YYYY-MM-DD HH:MM:SS` | Timestamp of the measurement. |
| `Busy System` | String | Percentage | Kernel-space CPU utilisation. |
| `Busy User` | String | Percentage | User-space CPU utilisation. |
| `Busy Iowait` | String | Percentage | CPU time waiting for I/O operations. |
| `Busy IRQs` | String | Percentage | CPU time handling hardware/software interrupts. |
| `Busy Other` | String | Percentage | Other CPU utilisation (steal, nice, etc.). |
| `Idle` | String | Percentage | CPU idle percentage. |

### RAM — Basic Format (Experiments 1, 2, 3)

| Column | Type | Unit / Format | Description |
|--------|------|---------------|-------------|
| `Time` | Datetime | `YYYY-MM-DD HH:MM:SS` | Timestamp of the measurement. |
| `Used` | String | GiB or MiB (e.g., `1.04 GiB`, `891 MiB`) | Memory in use at the recorded time step. |

### RAM — Joinbyfield Breakdown (Experiment 3)

| Column | Type | Unit / Format | Description |
|--------|------|---------------|-------------|
| `Time` | Datetime | `YYYY-MM-DD HH:MM:SS` | Timestamp of the measurement. |
| `Total` | String | GiB / MiB | Total physical memory available. |
| `Used` | String | GiB / MiB | Memory currently in use. |
| `Cache + Buffer` | String | GiB / MiB | Memory used for file-system cache and buffers. |
| `Free` | String | GiB / MiB | Unused memory. |
| `Swap used` | String | GiB / MiB / B | Swap space currently in use. |

---

## Key Statistics

| Metric | Value |
|--------|-------|
| Total records | 250,432 rows |
| Records — Experiment I | 63,269 |
| Records — Experiment II | 64,151 |
| Records — Experiment III | 123,012 |
| Total CSV files | 360 |
| Supplementary files (ML evaluation logs) | 2 |
| Total experiment duration | ~12 days — 280.23 hours |
| Idle Worker CPU range | 0.60% – 1.30% |
| CPU-stress Worker range | 1.68% – 97.6% |
| Idle Worker RAM range | 380 MB – 750 MB |
| RAM-stress Worker range | 1.11 GB – 3.8 GB |
| Sampling interval | 5 or 30 seconds |
| Kubernetes distributions | Vanilla K8s, K3s |
| Container Network Interfaces | Calico, Flannel |
| Metric categories | CPU, RAM |
| Compressed archive size | ~1.2 MB |
| Uncompressed size | ~6.6 MB |

---

## Data Format

- **Resource metrics:** CSV (Comma-Separated Values), UTF-8 encoded, with a header row.
- **ML evaluation logs:** Plain-text (TXT) files containing hyperparameters and per-device accuracy metrics.

---

## Data Storage

The dataset is published on **IEEE DataPort**:

> [https://ieee-dataport.org/documents/codef-dynamic-cloud-edge-resource-demand-dataset-kubernetes-experiments-and-stress](https://ieee-dataport.org/documents/codef-dynamic-cloud-edge-resource-demand-dataset-kubernetes-experiments-and-stress)

---

## Metadata and Standards

- Metadata standard: To be defined in a future revision.
- Time zone: Timestamps correspond to the local system clock of the Kubernetes cluster nodes at the time of export.
- Time resolution: 5 or 30 seconds.

---

## License

Dataset and documentation copyright 2025 ATHENA Research Center.
Licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

You are free to:
- **Share:** Copy and redistribute the material in any medium or format.
- **Adapt:** Remix, transform, and build upon the material for any purpose, including commercial.

Under the following terms:
- **Attribution:** You must give appropriate credit, provide a link to the license, and indicate if changes were made.

---

## Citation

If you use this dataset in your research, please cite the CODECO project:

```
CODECO — COgnitive DECentralized Orchestration
Horizon Europe Grant Agreement No. 101092696
Topic: HORIZON-CL4-2022-DATA-01
Dataset ID: HEU-101092696-CODECO-CODEF-Resources
```

---

## Contact

For questions regarding this dataset, please contact to [George Koukis](mailto:gkoukis@ee.duth.gr).

> **Project website:** [https://www.codeco-project.eu](https://www.codeco-project.eu)
