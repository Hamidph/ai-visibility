# AI Visibility Platform - Complete Deployment Guide

This guide will walk you through deploying the complete AI Visibility platform, including the backend API on Google Cloud Platform (GCP) and the frontend dashboard on Vercel.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment (GCP)](#backend-deployment-gcp)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Post-Deployment Configuration](#post-deployment-configuration)
5. [Cost Optimization](#cost-optimization)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Accounts Needed
- ✅ Google Cloud Platform account (free $300 credit available)
- ✅ Vercel account (free tier available)
- ✅ Stripe account (for billing)
- ✅ Gmail or SMTP account (for emails)
- ✅ GitHub account (for CI/CD)

### Tools Required
```bash
# Install Google Cloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Install Vercel CLI (optional)
npm install -g vercel

# Install PostgreSQL client (for local testing)
# On macOS
brew install postgresql

# On Ubuntu/Debian
sudo apt-get install postgresql-client
```

---

## Backend Deployment (GCP)

### Step 1: Set Up GCP Project

```bash
# Create a new project
gcloud projects create ai-visibility-prod --name="AI Visibility Production"

# Set as default project
gcloud config set project ai-visibility-prod

# Enable required APIs
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  sql-component.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  secretmanager.googleapis.com \
  vpcaccess.googleapis.com

# Set default region
gcloud config set run/region us-central1
```

### Step 2: Create PostgreSQL Database

```bash
# Create Cloud SQL PostgreSQL instance
gcloud sql instances create ai-visibility-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=10GB \
  --backup-start-time=03:00

# Create database
gcloud sql databases create ai_visibility \
  --instance=ai-visibility-db

# Create database user
gcloud sql users create ai_user \
  --instance=ai-visibility-db \
  --password=CHANGE_THIS_PASSWORD

# Get connection name (save this for later)
gcloud sql instances describe ai-visibility-db --format="value(connectionName)"
# Output will be: PROJECT_ID:REGION:INSTANCE_NAME
```

### Step 3: Create Redis Instance

```bash
# Create Redis instance
gcloud redis instances create ai-visibility-redis \
  --size=1 \
  --region=us-central1 \
  --redis-version=redis_7_0 \
  --tier=basic

# Get Redis host (save this for later)
gcloud redis instances describe ai-visibility-redis \
  --region=us-central1 \
  --format="value(host)"
```

### Step 4: Set Up Secrets

```bash
# Database URL
echo -n "postgresql://ai_user:CHANGE_THIS_PASSWORD@/ai_visibility?host=/cloudsql/PROJECT_ID:REGION:ai-visibility-db" | \
  gcloud secrets create database-url --data-file=-

# JWT Secret (generate a random string)
openssl rand -hex 32 | gcloud secrets create jwt-secret --data-file=-

# Stripe API Key
echo -n "sk_test_YOUR_STRIPE_SECRET_KEY" | \
  gcloud secrets create stripe-api-key --data-file=-

# Stripe Webhook Secret
echo -n "whsec_YOUR_STRIPE_WEBHOOK_SECRET" | \
  gcloud secrets create stripe-webhook-secret --data-file=-

# OpenAI API Key
echo -n "sk-YOUR_OPENAI_KEY" | \
  gcloud secrets create openai-api-key --data-file=-

# Anthropic API Key
echo -n "sk-ant-YOUR_ANTHROPIC_KEY" | \
  gcloud secrets create anthropic-api-key --data-file=-

# Perplexity API Key
echo -n "pplx-YOUR_PERPLEXITY_KEY" | \
  gcloud secrets create perplexity-api-key --data-file=-

# SMTP Password
echo -n "YOUR_GMAIL_APP_PASSWORD" | \
  gcloud secrets create smtp-password --data-file=-
```

### Step 5: Deploy Backend API

```bash
# Navigate to backend directory
cd backend

# Build and deploy using Cloud Build
gcloud builds submit --config=../cloudbuild.yaml

# Or manually deploy
gcloud run deploy ai-visibility-api \
  --image=gcr.io/PROJECT_ID/ai-visibility-api:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --set-env-vars="ENVIRONMENT=production,REDIS_HOST=REDIS_IP" \
  --set-secrets="DATABASE_URL=database-url:latest,JWT_SECRET=jwt-secret:latest" \
  --add-cloudsql-instances=PROJECT_ID:REGION:ai-visibility-db \
  --memory=1Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10

# Get the service URL (save this for frontend)
gcloud run services describe ai-visibility-api \
  --region=us-central1 \
  --format="value(status.url)"
```

### Step 6: Run Database Migrations

```bash
# Connect to Cloud SQL
gcloud sql connect ai-visibility-db --user=ai_user

# Or using Cloud Run job
gcloud run jobs create db-migrate \
  --image=gcr.io/PROJECT_ID/ai-visibility-api:latest \
  --command="alembic,upgrade,head" \
  --set-secrets="DATABASE_URL=database-url:latest" \
  --add-cloudsql-instances=PROJECT_ID:REGION:ai-visibility-db

gcloud run jobs execute db-migrate
```

### Step 7: Deploy Worker (Optional)

```bash
gcloud run deploy ai-visibility-worker \
  --image=gcr.io/PROJECT_ID/ai-visibility-worker:latest \
  --platform=managed \
  --region=us-central1 \
  --no-allow-unauthenticated \
  --set-env-vars="ENVIRONMENT=production,REDIS_HOST=REDIS_IP" \
  --set-secrets="DATABASE_URL=database-url:latest" \
  --add-cloudsql-instances=PROJECT_ID:REGION:ai-visibility-db \
  --memory=2Gi \
  --cpu=2 \
  --min-instances=1 \
  --max-instances=5
```

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local for local testing
cp .env.local.example .env.local

# Edit .env.local with your values:
# NEXT_PUBLIC_API_URL=https://YOUR_CLOUD_RUN_URL
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended for beginners)

1. Go to https://vercel.com and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your Cloud Run API URL
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy (from frontend directory)
vercel --prod

# Follow prompts and set environment variables
```

### Step 3: Configure Custom Domain (Optional)

```bash
# Add custom domain in Vercel dashboard
# Or using CLI:
vercel domains add yourdomain.com
vercel domains add www.yourdomain.com

# Configure DNS:
# Add A record: @ -> 76.76.21.21
# Add CNAME: www -> cname.vercel-dns.com
```

---

## Post-Deployment Configuration

### 1. Set Up Stripe Webhooks

```bash
# Get your Cloud Run API URL
BACKEND_URL=$(gcloud run services describe ai-visibility-api \
  --region=us-central1 --format="value(status.url)")

echo "Add this webhook URL in Stripe Dashboard:"
echo "${BACKEND_URL}/api/v1/billing/webhook"

# In Stripe Dashboard:
# 1. Go to Developers > Webhooks
# 2. Add endpoint: YOUR_BACKEND_URL/api/v1/billing/webhook
# 3. Select events:
#    - checkout.session.completed
#    - customer.subscription.created
#    - customer.subscription.updated
#    - customer.subscription.deleted
# 4. Copy the webhook secret and update in GCP Secret Manager
```

### 2. Configure CORS

Update `backend/app/core/config.py`:

```python
cors_origins: list[str] = Field(
    default=[
        "https://yourdomain.com",
        "https://www.yourdomain.com",
        "https://your-vercel-app.vercel.app",
    ]
)
```

### 3. Set Up Monitoring

```bash
# Enable Cloud Monitoring
gcloud services enable monitoring.googleapis.com

# Create uptime check
gcloud monitoring uptime create health-check \
  --display-name="API Health Check" \
  --resource-type=uptime-url \
  --url="${BACKEND_URL}/health"
```

### 4. Configure Email

For Gmail (recommended for testing):

1. Enable 2-Step Verification on your Gmail account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated password
3. Update secret in GCP:
   ```bash
   echo -n "YOUR_APP_PASSWORD" | \
     gcloud secrets versions add smtp-password --data-file=-
   ```

For production, consider using SendGrid, AWS SES, or Mailgun.

---

## Cost Optimization

### Free Tier Deployment (~$0/month for low traffic)

```bash
# Use smallest instances
# Cloud SQL: db-f1-micro (shared-core, 0.6GB RAM) - ~$7/month
# Redis: 1GB Basic tier - ~$35/month
# Cloud Run: Pay per request - Free tier: 2M requests/month

# Total: ~$42/month or FREE if using GCP $300 credit
```

### Optimized Production (~$156/month)

```bash
# Cloud SQL: db-g1-small (1 vCPU, 1.7GB RAM) - $35/month
# Redis: 5GB Standard tier - $100/month
# Cloud Run: ~$20/month (for moderate traffic)
# Cloud Storage: ~$1/month

# Total: ~$156/month
```

### Cost Saving Tips

1. **Use Cloud Run min-instances=0** for API to scale to zero
2. **Enable Cloud SQL maintenance window** during low traffic hours
3. **Use Cloud CDN** for static assets
4. **Set up budget alerts**:
   ```bash
   gcloud billing budgets create \
     --billing-account=BILLING_ACCOUNT_ID \
     --display-name="Monthly Budget" \
     --budget-amount=100USD \
     --threshold-rule=percent=50 \
     --threshold-rule=percent=90
   ```

---

## Troubleshooting

### Common Issues

#### 1. Database connection failed

```bash
# Check Cloud SQL is running
gcloud sql instances list

# Check connection name is correct
gcloud sql instances describe ai-visibility-db \
  --format="value(connectionName)"

# Verify secrets
gcloud secrets versions access latest --secret=database-url
```

#### 2. Frontend can't reach backend

```bash
# Check CORS settings in backend
# Verify NEXT_PUBLIC_API_URL is set correctly
# Check Cloud Run service is publicly accessible

# Test API endpoint
curl https://YOUR_CLOUD_RUN_URL/health
```

#### 3. Stripe webhooks not working

```bash
# Test webhook endpoint
curl -X POST https://YOUR_CLOUD_RUN_URL/api/v1/billing/webhook \
  -H "Content-Type: application/json" \
  -d '{}'

# Check webhook secret is correct
# Verify webhook URL in Stripe Dashboard
# Check Cloud Run logs:
gcloud run services logs read ai-visibility-api
```

#### 4. Email verification not sending

```bash
# Check SMTP settings
# Verify Gmail App Password
# Check logs for email errors

# Test SMTP connection:
python -c "
import smtplib
server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login('your-email@gmail.com', 'APP_PASSWORD')
print('SMTP connection successful!')
"
```

### Viewing Logs

```bash
# Cloud Run API logs
gcloud run services logs read ai-visibility-api --limit=50

# Cloud Run Worker logs
gcloud run services logs read ai-visibility-worker --limit=50

# Cloud SQL logs
gcloud sql operations list --instance=ai-visibility-db

# Vercel logs
vercel logs
```

---

## Security Checklist

- [ ] All secrets stored in Secret Manager (not hardcoded)
- [ ] Cloud SQL accessible only via Cloud Run (not public IP)
- [ ] CORS configured to allow only your frontend domain
- [ ] Stripe webhook signature verification enabled
- [ ] Rate limiting configured (SlowAPI)
- [ ] HTTPS enforced everywhere
- [ ] Database backups enabled (automatic in Cloud SQL)
- [ ] Monitoring and alerting set up
- [ ] API keys have expiration dates
- [ ] Regular dependency updates (Dependabot)

---

## Next Steps

After deployment:

1. **Test the complete flow**:
   - Register a new user
   - Verify email
   - Create an experiment
   - Upgrade subscription (use Stripe test mode)
   - Generate API key

2. **Set up CI/CD**:
   - GitHub Actions already configured in `.github/workflows/ci-cd.yml`
   - Add GCP credentials as GitHub secret
   - Enable automatic deployments on push to main

3. **Monitor performance**:
   - Set up Google Cloud Monitoring dashboards
   - Configure Sentry for error tracking
   - Review Stripe Dashboard for billing

4. **Prepare for investors**:
   - Create demo data
   - Set up analytics (Google Analytics)
   - Document API endpoints
   - Create pitch deck with live demo

---

## Support

If you encounter issues:

1. Check the logs (commands above)
2. Review this guide
3. Check the main `IMPLEMENTATION_REPORT.md` for architecture details
4. Consult GCP documentation: https://cloud.google.com/docs
5. Consult Vercel documentation: https://vercel.com/docs

---

## Appendix: Environment Variables Reference

### Backend (.env)

```bash
# Database
DATABASE_URL=postgresql://user:pass@host/db
DATABASE_URL_SYNC=postgresql://user:pass@host/db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
JWT_SECRET=your-secret-key
SECRET_KEY=your-secret-key

# Stripe
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=AI Visibility

# Frontend URL (for email links)
FRONTEND_URL=https://yourdomain.com

# LLM Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
PERPLEXITY_API_KEY=pplx-...

# Monitoring (optional)
SENTRY_DSN=https://...@sentry.io/...

# Environment
ENVIRONMENT=production
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=https://your-cloud-run-url
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

**🎉 Congratulations! Your AI Visibility platform is now deployed and ready to use!**
