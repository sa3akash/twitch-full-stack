Sure! Here are some great free options with quick installation and simple commands:

### 1. **LocalTunnel** (Free, easy, cross-platform)

**Install & Run:**
```bash
npx localtunnel --port YOUR_PORT
```

**Example (if your server runs on port 8080):**
```bash
npx localtunnel --port 8080
```
It will give you a URL like `https://xyz.loca.lt` that forwards to your local server.

---

### 2. **Serveo** (No installation, via SSH)

**Run:**
```bash
ssh -R 80:localhost:YOUR_PORT serveo.net
```

**Example (port 8080):**
```bash
ssh -R 80:localhost:8080 serveo.net
```
It will display a URL like `https://yourname.serveo.net`.

---

### 3. **Cloudflare Tunnel (free tier)**

- **Install cloudflared:**

**For Linux / macOS:**
```bash
brew install cloudflared
```

**For Windows (via scoop or manually):**
Download from [Cloudflare](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/).

- **Create & run tunnel:**

```bash
cloudflared tunnel --url http://localhost:YOUR_PORT
```

This creates a secure HTTPS tunnel with a Cloudflare URL.

---

**Summary:**

| Tool             | Setup                        | Command Example                     | Notes                            |
|------------------|------------------------------|-------------------------------------|----------------------------------|
| LocalTunnel      | No install, just npx        | `npx localtunnel --port 8080`     | Very quick, free               |
| Serveo          | SSH (no install)             | `ssh -R 80:localhost:8080 serveo.net` | No setup, simple              |
| Cloudflare Tunnel| Install cloudflared          | `cloudflared tunnel --url localhost:8080` | More robust, free tier       |

Would you like detailed step-by-step instructions for any of these?