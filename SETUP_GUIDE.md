# SHA Claims Fixer - Setup Guide

## Table of Contents
1. [Meta WhatsApp Business Setup](#1-meta-whatsapp-business-setup)
2. [M-Pesa Daraja API Setup](#2-mpesa-daraja-api-setup)
3. [Backend Deployment](#3-backend-deployment)
4. [Frontend Deployment](#4-frontend-deployment)
5. [Environment Variables](#5-environment-variables)

---

## 1. Meta WhatsApp Business Setup

### Step 1: Create a Meta Business Account
1. Go to [business.facebook.com](https://business.facebook.com)
2. Click "Create Account" and follow the prompts
3. Verify your business (required for production)

### Step 2: Set Up WhatsApp Business Platform
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new app:
   - Select "Business" as the app type
   - Name your app (e.g., "SHA Claims Fixer")
3. Add WhatsApp product to your app:
   - Go to App Dashboard → Add Product → WhatsApp

### Step 3: Get Your Credentials
1. **Phone Number ID**: 
   - Go to WhatsApp → API Setup
   - Find "Phone Number ID" (e.g., `123456789012345`)
   
2. **Business Account ID**:
   - In the same page, find "Business Account ID" (e.g., `987654321098765`)

3. **Access Token**:
   - Generate a permanent access token
   - Required permissions: `whatsapp_business_messaging`, `whatsapp_business_management`

### Step 4: Configure Webhook
1. In WhatsApp → Configuration, click "Edit"
2. Set Callback URL: `https://your-api-url.com/webhooks/whatsapp`
3. Set Verify Token: Create a secure random string
4. Subscribe to fields: `messages`, `message_template_status_update`

### Step 5: Create Message Templates
Create these templates in your Meta Business Account:

#### Template 1: claim_received
```json
{
  "name": "claim_received",
  "language": "en",
  "category": "UTILITY",
  "components": [
    {
      "type": "BODY",
      "text": "Hello {{1}}, your claim {{2}} has been received. Our team will review it and get back to you shortly."
    }
  ]
}
```

#### Template 2: payment_required
```json
{
  "name": "payment_required",
  "language": "en",
  "category": "UTILITY",
  "components": [
    {
      "type": "BODY",
      "text": "Your claim {{1}} is ready for processing. Please complete the payment of {{2}} to receive the corrected document."
    }
  ]
}
```

#### Template 3: claim_ready
```json
{
  "name": "claim_ready",
  "language": "en",
  "category": "UTILITY",
  "components": [
    {
      "type": "HEADER",
      "format": "DOCUMENT",
      "example": {
        "header_handle": ["DOCUMENT_URL_HERE"]
      }
    },
    {
      "type": "BODY",
      "text": "Your corrected claim {{1}} is ready! Thank you for using SHA Claims Fixer."
    }
  ]
}
```

---

## 2. M-Pesa Daraja API Setup

### Step 1: Create Safaricom Developer Account
1. Go to [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Sign up for a new account
3. Create a new app

### Step 2: Get API Credentials
1. **Consumer Key**: Found in your app dashboard
2. **Consumer Secret**: Found in your app dashboard
3. **Passkey**: For sandbox, use `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`

### Step 3: Configure Callback URLs
In your Daraja app settings:
- **Callback URL**: `https://your-api-url.com/webhooks/mpesa/callback`
- **Validation URL**: `https://your-api-url.com/webhooks/mpesa/validation`
- **Confirmation URL**: `https://your-api-url.com/webhooks/mpesa/confirmation`

### Step 4: Set Up Shortcode
For sandbox testing, use the default shortcode: `174379`

For production:
1. Apply for a Paybill or Till Number from Safaricom
2. Configure it in your Daraja app

---

## 3. Backend Deployment

### Option A: Deploy to Render

1. **Create a new Web Service**:
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository

2. **Configure Build Settings**:
   ```
   Build Command: cd backend && npm install && npm run build
   Start Command: cd backend && npm start
   ```

3. **Add Environment Variables**:
   - Copy all variables from `.env.example`
   - Fill in your actual values

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete

### Option B: Deploy to Railway

1. **Create a new Project**:
   - Go to [railway.app](https://railway.app)
   - Create a new project
   - Deploy from GitHub repo

2. **Configure**:
   - Set root directory to `backend`
   - Add environment variables
   - Deploy

### Option C: Deploy to VPS (DigitalOcean, AWS, etc.)

1. **Set up server**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Deploy code**:
   ```bash
   git clone <your-repo>
   cd sha-claims-fixer/backend
   npm install
   npm run build
   ```

3. **Create .env file**:
   ```bash
   nano .env
   # Paste your environment variables
   ```

4. **Start with PM2**:
   ```bash
   pm2 start dist/server.js --name "sha-claims-api"
   pm2 save
   pm2 startup
   ```

5. **Set up Nginx (optional)**:
   ```bash
   sudo apt install nginx
   # Configure reverse proxy
   ```

---

## 4. Frontend Deployment

### Deploy to Vercel

1. **Push code to GitHub**

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`

3. **Configure Build**:
   ```
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-api-url.com
   ```

5. **Deploy**

### Deploy to Netlify

1. **Build locally**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy**:
   - Drag and drop the `dist` folder to Netlify
   - Or connect GitHub for auto-deploy

---

## 5. Environment Variables

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=5000
API_BASE_URL=https://your-api-url.com
FRONTEND_URL=https://your-frontend-url.com

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sha-claims-db

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=7d

# Meta WhatsApp
META_ACCESS_TOKEN=EAABsbCS1iHgBA...
META_PHONE_NUMBER_ID=123456789012345
META_BUSINESS_ACCOUNT_ID=987654321098765
META_WEBHOOK_VERIFY_TOKEN=your-webhook-verify-token
META_API_BASE_URL=https://graph.facebook.com/v18.0
META_APP_SECRET=your-meta-app-secret

# M-Pesa
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_CONSUMER_SECRET=your-consumer-secret
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_SHORTCODE=174379
MPESA_ENVIRONMENT=sandbox
MPESA_CALLBACK_URL=https://your-api-url.com/webhooks/mpesa/callback
MPESA_VALIDATION_URL=https://your-api-url.com/webhooks/mpesa/validation
MPESA_CONFIRMATION_URL=https://your-api-url.com/webhooks/mpesa/confirmation

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Security
ENCRYPTION_KEY=your-32-char-encryption-key!!
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Application
CLAIM_PRICE_KES=300
WEEKLY_RETAINER_KES=5000
FREE_CLAIMS_PER_MONTH=1
CLAIM_IMAGE_RETENTION_DAYS=90
```

### Frontend (.env)

```env
VITE_API_URL=https://your-api-url.com
```

---

## Testing Your Setup

### Test WhatsApp Webhook
```bash
curl -X GET "https://your-api-url.com/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=test_challenge"
```

### Test M-Pesa STK Push
```bash
curl -X POST https://your-api-url.com/api/mpesa/stkpush \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "254712345678",
    "amount": 1,
    "accountReference": "TEST",
    "transactionDesc": "Test payment"
  }'
```

### Test Health Endpoint
```bash
curl https://your-api-url.com/health
```

---

## Troubleshooting

### WhatsApp Messages Not Received
1. Check webhook URL is correct and publicly accessible
2. Verify webhook verification token matches
3. Check Meta app has necessary permissions
4. Review server logs for errors

### M-Pesa Payments Not Working
1. Verify callback URLs are HTTPS
2. Check consumer key and secret are correct
3. Ensure passkey is correct for environment
4. Review Daraja API logs

### Database Connection Issues
1. Check MongoDB URI is correct
2. Ensure IP whitelist includes your server
3. Verify credentials are correct

---

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact support at support@shaclaims.co.ke
