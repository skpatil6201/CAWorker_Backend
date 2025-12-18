# Deployment Guide

This guide covers deploying the S K ASSOCIATES - CA Worker Backend API to various environments.

## 🚀 Quick Deployment Checklist

### Pre-Deployment
- [ ] Update environment variables for production
- [ ] Change default admin password
- [ ] Set secure JWT secret (minimum 32 characters)
- [ ] Configure CORS origins
- [ ] Set up proper logging
- [ ] Test all endpoints
- [ ] Build the application

### Production Environment Variables
```env
NODE_ENV=production
PORT=8080
JWT_SECRET=your_secure_64_character_jwt_secret_key_here_change_this
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🌐 Platform-Specific Deployment

### Heroku

1. **Install Heroku CLI and login:**
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku app:**
```bash
heroku create your-app-name
```

3. **Set environment variables:**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secure_jwt_secret
heroku config:set ALLOWED_ORIGINS=https://your-frontend-domain.com
```

4. **Deploy:**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

5. **Open app:**
```bash
heroku open
```

### Railway

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login and deploy:**
```bash
railway login
railway init
railway up
```

3. **Set environment variables in Railway dashboard**

### Render

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Set build command:** `npm run build`
4. **Set start command:** `npm start`
5. **Add environment variables in Render dashboard**

### DigitalOcean App Platform

1. **Create new app from GitHub repository**
2. **Set build command:** `npm run build`
3. **Set run command:** `npm start`
4. **Configure environment variables**

### AWS EC2

1. **Launch EC2 instance with Node.js**
2. **Clone repository:**
```bash
git clone <your-repo-url>
cd server
```

3. **Install dependencies:**
```bash
npm install
```

4. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with production values
```

5. **Build and start:**
```bash
npm run build
npm start
```

6. **Set up PM2 for process management:**
```bash
npm install -g pm2
pm2 start dist/index.js --name "ca-worker-api"
pm2 startup
pm2 save
```

### Docker Deployment

1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 8080

USER node

CMD ["npm", "start"]
```

2. **Create .dockerignore:**
```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
Dockerfile
.dockerignore
```

3. **Build and run:**
```bash
docker build -t ca-worker-api .
docker run -p 8080:8080 --env-file .env ca-worker-api
```

### Docker Compose

1. **Create docker-compose.yml:**
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

2. **Deploy:**
```bash
docker-compose up -d
```

## 🔧 Production Configuration

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL/TLS with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Process Management with PM2

```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'ca-worker-api',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

## 📊 Monitoring & Logging

### Health Monitoring

Set up monitoring for:
- `/health` endpoint
- Response times
- Error rates
- Memory usage
- CPU usage

### Log Management

```bash
# Create log directory
mkdir -p logs

# Set up log rotation
sudo nano /etc/logrotate.d/ca-worker-api
```

Add to logrotate config:
```
/path/to/your/app/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 node node
}
```

### Environment-Specific Logging

```javascript
// In production, consider using structured logging
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure JWT secret (64+ characters)
- [ ] Configure proper CORS origins
- [ ] Enable rate limiting
- [ ] Set up security headers
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities
- [ ] Set up firewall rules
- [ ] Use non-root user for application

### Database Security (Future)

When migrating to a database:
- [ ] Use connection pooling
- [ ] Enable SSL for database connections
- [ ] Use database user with minimal permissions
- [ ] Regular database backups
- [ ] Encrypt sensitive data at rest

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use:**
```bash
# Find process using port
lsof -i :8080
# Kill process
kill -9 <PID>
```

2. **Permission denied:**
```bash
# Fix file permissions
chmod +x setup.js
chmod +x test-api.js
```

3. **Module not found:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

4. **TypeScript compilation errors:**
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

### Performance Optimization

1. **Enable gzip compression:**
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Use clustering:**
```javascript
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Start server
}
```

3. **Implement caching:**
```javascript
const redis = require('redis');
const client = redis.createClient();
```

## 📞 Support

For deployment issues:
1. Check the logs first
2. Verify environment variables
3. Test locally before deploying
4. Check platform-specific documentation
5. Contact the development team

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build
      
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

Remember to update this guide as your deployment requirements evolve!