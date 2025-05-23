Great! Here's a more detailed guide with full configurations to deploy Prometheus, Grafana, and your microservices on Kubernetes using Helm. I'll clarify how to set up everything, including whether to deploy Prometheus and Grafana separately or as dependencies.

---

### **1. Deployment Strategy: Prometheus & Grafana**

- **Separation:** It's common practice to deploy Prometheus and Grafana as separate Helm releases. This way, you can manage, upgrade, and troubleshoot each independently.
- **Helm Charts:** Use the official `prometheus-community/kube-prometheus-stack` Helm chart, which simplifies deploying Prometheus, Alertmanager, and Grafana as a package.

---

### **2. Helm Chart Deployment: `kube-prometheus-stack`**

#### **a. Add the Helm repo**

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

#### **b. Deploy Prometheus + Grafana**

```bash
helm install monitoring prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace
```

- This chart includes Prometheus, Grafana, and some default dashboards.

---

### **3. Configure Prometheus to Scrape Your Services**

#### **a. Expose your Node.js metrics endpoints**
Ensure your services expose `/metrics`.

#### **b. Create `ServiceMonitor` objects**

- Define in YAML, **customized to match your services**.
- For example, for two projects:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: project1
  labels:
    release: monitoring  # must match label selector
spec:
  selector:
    matchLabels:
      app: project1-service
  namespaceSelector:
    matchNames:
      - default
  endpoints:
    - port: http
      path: /metrics
      interval: 15s

---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: project2
  labels:
    release: monitoring
spec:
  selector:
    matchLabels:
      app: project2-service
  namespaceSelector:
    matchNames:
      - default
  endpoints:
    - port: http
      path: /metrics
      interval: 15s
```

- Add these `ServiceMonitor` YAML files into your cluster:

```bash
kubectl apply -f service-monitors.yaml
```

**Note:** `release: monitoring` label is used to let Prometheus discover these ServiceMonitors.

---

### **4. Configure Your Node.js Services**

Sample `Dockerfile` and app:

```js
const client = require('prom-client');
const express = require('express');

const app = express();
const register = new client.Registry();

const counter = new client.Counter({
  name: 'my_service_requests_total',
  help: 'Total requests handled',
  labelNames: ['project'],
});
register.registerMetric(counter);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(3000, () => {
  console.log('Server running...');
});
```

### **5. Deploy Your Services**

Create your deployment YAMLs with labels matching your ServiceMonitors (e.g., `app: project1-service` and `app: project2-service`).

---

### **6. Access Grafana and Create Dashboards**

- **Grafana URL**: Usually at `http://<your-k8s-node-ip>:3000`
- **Default credentials**: `admin / soma` (or check your Helm release output).

- **Add Prometheus as data source**:
  - URL: `http://monitoring-kube-prometheus-stack-prometheus.monitoring:9090`

- **Create dashboards**:
  - Use queries like:
    - `sum(rate(my_service_requests_total{project="project1"}[5m]))`
  - Use variables to switch between projects.

---

### **Summary**

| Step | Action | Notes |
|--------|--------------------------|----------------------------------------------|
| 1      | Deploy `kube-prometheus-stack` | Fully featured stack with Prometheus & Grafana |
| 2      | Configure `ServiceMonitor` | To scrape your microservices' `/metrics` endpoints |
| 3      | Expose metrics in your services | Use `prom-client`, expose `/metrics` |
| 4      | Label services properly | For filtering in Grafana |
| 5      | Access Grafana and build dashboards | Use Prometheus as data source |

---

Would you like me to generate **full Helm chart manifests** or **sample deployment YAMLs** for your services?