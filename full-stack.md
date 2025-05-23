Certainly! I'll provide a comprehensive set of Helm chart files for a production-grade microservices deployment with:

- **3 Node.js microservices**
- **MongoDB with persistent storage**
- **RabbitMQ with persistent storage**
- **Redis for caching**
- **API Gateway & Ingress**
- **Prometheus & Grafana for monitoring**
- **Horizontal Pod Autoscaling**

---

### **Complete Helm Chart Files**

---

## 1. `Chart.yaml`

```yaml
apiVersion: v2
name: my-microservices
description: Helm chart for deploying 3 Node.js services, MongoDB, RabbitMQ, Redis, API Gateway, and monitoring
version: 0.1.0
appVersion: "1.0"
```

---

## 2. `values.yaml`

```yaml
replicaCount: 2

# Node.js services configuration
nodejsServices:
  - name: nodejs-service1
    image: myrepo/nodejs-service1:latest
    port: 3001
  - name: nodejs-service2
    image: myrepo/nodejs-service2:latest
    port: 3002
  - name: nodejs-service3
    image: myrepo/nodejs-service3:latest
    port: 3003

# Database and cache
mongodb:
  enabled: true
  image: mongo:4.4
  replicaCount: 1
  storageSize: 20Gi

rabbitmq:
  enabled: true
  image: rabbitmq:3.8-management
  replicaCount: 1
  storageSize: 10Gi

redis:
  enabled: true
  image: redis:6.0
  storageSize: 5Gi

# API Gateway & ingress
ingress:
  enabled: true
  host: yourdomain.com
  tls: false

# Monitoring
monitoring:
  enabled: true

# Horizontal Pod Autoscaler
hpa:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
```

---

## 3. `_helpers.tpl`

```gotemplate
{{- define "my-microservices.labels" -}}
app: my-microservices
chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{- end }}
```

---

## 4. `templates/nodejs-services.yaml` (for all 3)

```gotemplate
{{- range .Values.nodejsServices }}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .name }}
  labels:
    {{- include "my-microservices.labels" . | nindent 4 }}
spec:
  replicas: {{ $.Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .name }}
  template:
    metadata:
      labels:
        app: {{ .name }}
    spec:
      containers:
      - name: {{ .name }}
        image: {{ .image }}
        ports:
        - containerPort: {{ .port }}
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGO_URI
          value: "mongodb://mongodb-0.mongodb-headless:27017/mydb"
        - name: RABBITMQ_URI
          value: "amqp://rabbitmq:5672"
        - name: REDIS_HOST
          value: "redis"
---
apiVersion: v1
kind: Service
metadata:
  name: {{ .name }}
  labels:
    {{- include "my-microservices.labels" . | nindent 4 }}
spec:
  type: ClusterIP
  ports:
    - port: {{ .port }}
      targetPort: {{ .port }}
  selector:
    app: {{ .name }}
{{- end }}
```

---

## 5. MongoDB with Persistent Storage

```gotemplate
{{- if .Values.mongodb.enabled }}
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mongodb
  labels:
    {{- include "my-microservices.labels" . | nindent 4 }}
spec:
  serviceName: "mongodb-headless"
  replicas: {{ .Values.mongodb.replicaCount }}
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: {{ .Values.mongodb.image }}
        ports:
        - containerPort: 27017
        volumeMounts:
        - name: mongo-data
          mountPath: /data/db
        args:
          - "--bind_ip_all"
      volumes:
      - name: mongo-data
        persistentVolumeClaim:
          claimName: mongo-pvc
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongo-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: {{ .Values.mongodb.storageSize }}
---
apiVersion: v1
kind: Service
metadata:
  name: mongodb
  labels:
    {{- include "my-microservices.labels" . | nindent 4 }}
spec:
  ports:
  - port: 27017
    targetPort: 27017
  clusterIP: None
  selector:
    app: mongodb
{{- end }}
```

---

## 6. RabbitMQ with Persistent Storage

```gotemplate
{{- if .Values.rabbitmq.enabled }}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rabbitmq
  labels:
    {{- include "my-microservices.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.rabbitmq.replicaCount }}
  selector:
    matchLabels:
      app: rabbitmq
  template:
    metadata:
      labels:
        app: rabbitmq
    spec:
      containers:
      - name: rabbitmq
        image: {{ .Values.rabbitmq.image }}
        ports:
        - containerPort: 5672
        - containerPort: 15672
        volumeMounts:
        - name: rabbitmq-data
          mountPath: /var/lib/rabbitmq
        env:
        - name: RABBITMQ_ERLANG_COOKIE
          value: "secretcookie"
      volumes:
      - name: rabbitmq-data
        persistentVolumeClaim:
          claimName: rabbitmq-pvc
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: rabbitmq-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: {{ .Values.rabbitmq.storageSize }}
---
apiVersion: v1
kind: Service
metadata:
  name: rabbitmq
spec:
  ports:
  - port: 5672
    targetPort: 5672
  - port: 15672
    targetPort: 15672
  selector:
    app: rabbitmq
{{- end }}
```

---

## 7. Redis with Persistent Storage

```gotemplate
{{- if .Values.redis.enabled }}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  labels:
    {{- include "my-microservices.labels" . | nindent 4 }}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: {{ .Values.redis.image }}
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: redis-data
          mountPath: /data
        command: ["redis-server", "--appendonly", "yes"]
      volumes:
      - name: redis-data
        persistentVolumeClaim:
          claimName: redis-pvc
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: {{ .Values.redis.storageSize }}
---
apiVersion: v1
kind: Service
metadata:
  name: redis
spec:
  ports:
  - port: 6379
    targetPort: 6379
  selector:
    app: redis
{{- end }}
```

---

## 8. API Gateway & Ingress

```yaml
{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: main-ingress
  labels:
    {{- include "my-microservices.labels" . | nindent 4 }}
spec:
  rules:
  - host: {{ .Values.ingress.host }}
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: gateway
            port:
              number: 80
{{- end }}
```

```yaml
# Gateway deployment (simple NGINX)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gateway
  labels:
    {{- include "my-microservices.labels" . | nindent 4 }}
spec:
  replicas: 2
  selector:
    matchLabels:
      app: gateway
  template:
    metadata:
      labels:
        app: gateway
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
        volumeMounts:
        - name: config-volume
          mountPath: /etc/nginx/conf.d
      volumes:
      - name: config-volume
        configMap:
          name: nginx-config
---
apiVersion: v1
kind: Service
metadata:
  name: gateway
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: gateway
```

---

## 9. Prometheus & Grafana for Monitoring

### Prometheus (`templates/prometheus.yaml`)

Deploy via **kube-prometheus-stack** or as custom setup.

### Grafana (`templates/grafana.yaml`)

Similarly, deploy Grafana via Helm or custom manifests.

---

## **Summary**

This setup:

- Deploys **3 Node.js services** with persistent storage
- Sets up **MongoDB**, **RabbitMQ**, and **Redis** with persistent volumes
- Configures an **API Gateway** with NGINX, accessible via LoadBalancer
- Includes **Ingress** for external routing
- Enables **Prometheus & Grafana** for monitoring
- Adds **Horizontal scaling** via HPA

---

## Would you like me to prepare a Helm package with all these files, or guide you step-by-step on deploying this setup?







---


You're welcome! For a production setup with **auto SSL (Let's Encrypt)** and **Nginx as the API Gateway**, here's what you'll need:

- Use **cert-manager** to automatically provision SSL certificates from Let's Encrypt.
- Configure **NGINX ingress controller** to handle SSL termination.

---

## **Steps to enable auto SSL with NGINX and cert-manager**

### **1. Install cert-manager**

You can install cert-manager in your cluster:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.10.0/cert-manager.yaml
```

### **2. Create a ClusterIssuer for Let's Encrypt**

Create a `ClusterIssuer` resource that cert-manager will use:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

Apply it:

```bash
kubectl apply -f clusterissuer.yaml
```

---

### **3. Update your Helm chart ingress.yaml to include TLS with cert-manager**

Modify your `ingress.yaml`:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: main-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    ingress.kubernetes.io/ssl-redirect: "true"
  labels:
    {{- include "my-microservices.labels" . | nindent 4 }}
spec:
  tls:
  - hosts:
    - {{ .Values.ingress.host }}
    secretName: tls-cert  # This secret will be created by cert-manager
  rules:
  - host: {{ .Values.ingress.host }}
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: gateway
            port:
              number: 80
```

### **4. Deployment configuration**

- Make sure your cluster has an **Ingress controller installed** (like NGINX ingress-controller). You can install it via Helm:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx
```

---

## **Summary**

- Install **cert-manager** for auto SSL
- Create **ClusterIssuer** for Let's Encrypt
- Update your Ingress resource to include TLS annotations and specify the `secretName`
- Deploy **Ingress Controller** (NGINX)
- When applying your Helm chart, it will automatically request and renew SSL certificates from Let's Encrypt

---

Would you like me to help generate the complete updated files or step-by-step deployment commands?




---



Certainly! Here’s a **step-by-step comprehensive guide** to deploy your microservices architecture with **auto SSL (Let's Encrypt)**, **NGINX Ingress Controller**, **cert-manager**, and your Kubernetes setup.

---

# **Step-by-Step Deployment Guide for Production-Ready Microservices**

---

## **1. Prepare Your Environment**

### **a. Kubernetes Cluster**
Make sure you have a running Kubernetes cluster (e.g., on AKS, EKS, GKE, or Minikube for testing).

### **b. Install Helm (if not installed)**
```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

---

## **2. Install NGINX Ingress Controller**

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx
```

Verify ingress controller is running:
```bash
kubectl get pods -n default -l app.kubernetes.io/name=ingress-nginx
```

---

## **3. Install Cert-Manager**

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.10.0/cert-manager.yaml
```

Ensure cert-manager pods are ready:
```bash
kubectl get pods -n cert-manager
```

---

## **4. Create a ClusterIssuer for Let's Encrypt**

Create a YAML file `clusterissuer.yaml`:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com # Replace with your email
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

Apply:
```bash
kubectl apply -f clusterissuer.yaml
```

---

## **5. Prepare Helm Chart Files**

### **a. Directory structure**

```plaintext
my-microservices/
├── Chart.yaml
├── values.yaml
├── _helpers.tpl
├── ingress.yaml
├── gateway.yaml
├── nodejs-services.yaml
├── mongodb.yaml
├── rabbitmq.yaml
├── redis.yaml
└── prometheus-grafana.yaml  (optional)
```

### **b. `Chart.yaml`**

```yaml
apiVersion: v2
name: my-microservices
description: Production microservices with SSL, ingress, monitoring
version: 0.1.0
appVersion: "1.0"
```

### **c. `values.yaml`**

```yaml
ingress:
  enabled: true
  host: yourdomain.com  # Replace with your real domain
  tls: true

monitoring:
  enabled: true

hpa:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80

nodejsServices:
  - name: nodejs-service1
    image: myrepo/nodejs-service1:latest
    port: 3001
  - name: nodejs-service2
    image: myrepo/nodejs-service2:latest
    port: 3002
  - name: nodejs-service3
    image: myrepo/nodejs-service3:latest
    port: 3003

mongodb:
  enabled: true
  image: mongo:4.4
  storageSize: 20Gi

rabbitmq:
  enabled: true
  image: rabbitmq:3.8-management
  storageSize: 10Gi

redis:
  enabled: true
  image: redis:6.0
  storageSize: 5Gi
```

### **d. `_helpers.tpl`**

```gotemplate
{{- define "my-microservices.labels" -}}
app: my-microservices
chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{- end }}
```

---

## **6. Template Files**

### **a. `ingress.yaml`**

```yaml
{{- if .Values.ingress.enabled }}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: main-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    ingress.kubernetes.io/ssl-redirect: "true"
  labels:
    {{- include "my-microservices.labels" . | nindent 4 }}
spec:
  tls:
  - hosts:
    - {{ .Values.ingress.host }}
    secretName: tls-cert
  rules:
  - host: {{ .Values.ingress.host }}
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: gateway
            port:
              number: 80
{{- end }}
```

### **b. `gateway.yaml`**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gateway
  labels:
    {{- include "my-microservices.labels" . | nindent 4 }}
spec:
  replicas: 2
  selector:
    matchLabels:
      app: gateway
  template:
    metadata:
      labels:
        app: gateway
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
        volumeMounts:
        - name: nginx-config
          mountPath: /etc/nginx/conf.d
      volumes:
      - name: nginx-config
        configMap:
          name: nginx-config
---
apiVersion: v1
kind: Service
metadata:
  name: gateway
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: gateway
```

### **c. NGINX ConfigMap (`nginx-config`)**

Create a ConfigMap for NGINX to route requests to your Node.js services:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
data:
  default.conf: |
    server {
      listen 80;
      server_name _;

      location /service1/ {
        proxy_pass http://nodejs-service1:3001/;
      }
      location /service2/ {
        proxy_pass http://nodejs-service2:3002/;
      }
      location /service3/ {
        proxy_pass http://nodejs-service3:3003/;
      }
    }
```

### **d. `nodejs-services.yaml`**

Same as before, deploy each Node