# SHA Claims Fixer

A comprehensive Remote SHA Claims Management system for private hospitals in Kenya, integrating Meta WhatsApp Business Cloud API and M-Pesa Daraja API.

## Features

### Core Functionality
- **WhatsApp Integration**: Receive claims via WhatsApp messages (images, documents)
- **M-Pesa Payments**: Automated STK Push for per-claim payments (KES 300)
- **Claim Management**: Full lifecycle tracking from submission to completion
- **Hospital CRM**: Complete hospital profiles with subscription management
- **Document Management**: Cloud storage with annotation capabilities
- **Analytics Dashboard**: Real-time insights and reporting

### Security & Compliance
- **HIPAA-lite**: AES-256 encryption for patient data
- **Data Protection**: SHA-256 hashing for patient identifiers
- **Auto-deletion**: Claim images deleted after 90 days
- **Rate Limiting**: 10 requests/minute per hospital
- **Webhook Signature Verification**: X-Hub-Signature-256 validation

### Monetization
- **Free Tier**: 1 audit per month
- **Per-Claim**: KES 300 (M-Pesa STK push)
- **Weekly Retainer**: KES 5,000 (unlimited claims)

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **File Storage**: Cloudinary
- **Authentication**: JWT

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query

### Integrations
- **WhatsApp**: Meta Business Cloud API (Graph API v18.0+)
- **Payments**: Safaricom M-Pesa Daraja API
- **Cloud Storage**: Cloudinary

## Project Structure

```
sha-claims-fixer/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── config/            # Database, Cloudinary config
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Auth, rate limiting, error handling
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Helpers, encryption
│   └── package.json
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── layouts/           # Page layouts
│   │   ├── lib/               # API clients, utilities
│   │   ├── pages/             # Route pages
│   │   ├── store/             # Zustand stores
│   │   └── types/             # TypeScript types
│   └── package.json
├── SETUP_GUIDE.md             # Detailed setup instructions
├── MESSAGE_TEMPLATES.md       # WhatsApp template definitions
└── README.md                  # This file
```

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Meta Business Account
- Safaricom Developer Account
- Cloudinary Account

### 1. Clone Repository
```bash
git clone <repository-url>
cd sha-claims-fixer
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

### 4. Configure Environment Variables

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed configuration instructions.

## API Endpoints

### WhatsApp Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/webhooks/whatsapp` | Webhook verification |
| POST | `/webhooks/whatsapp` | Receive messages |

### M-Pesa Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhooks/mpesa/callback` | STK Push callback |
| POST | `/webhooks/mpesa/validation` | C2B validation |
| POST | `/webhooks/mpesa/confirmation` | C2B confirmation |

### Claims API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/claims` | List claims |
| GET | `/api/claims/:id` | Get claim details |
| PATCH | `/api/claims/:id/status` | Update claim status |
| POST | `/api/claims/:id/analysis` | Submit analysis |
| POST | `/api/claims/:id/corrected-document` | Upload corrected document |

### Hospitals API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hospitals` | List hospitals |
| POST | `/api/hospitals` | Create hospital |
| GET | `/api/hospitals/:id` | Get hospital details |
| PATCH | `/api/hospitals/:id/subscription` | Update subscription |

## Workflow

1. **Hospital sends claim** → WhatsApp webhook → Download image → Create ticket
2. **Review in dashboard** → Annotate corrections → Upload corrected PDF
3. **Check subscription**:
   - Active retainer → Send "claim_ready" template
   - No retainer → Send "payment_required" + M-Pesa STK push
4. **M-Pesa callback** → Auto-send corrected claim via WhatsApp
5. **24-hour session window** → Free-form replies; outside window → Templates only

## Deployment

### Backend (Render/Railway)
```bash
# Build
cd backend
npm install
npm run build

# Start
npm start
```

### Frontend (Vercel/Netlify)
```bash
# Build
cd frontend
npm install
npm run build

# Deploy dist/ folder
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

## Environment Variables

### Backend
```env
# Server
NODE_ENV=production
PORT=5000
API_BASE_URL=https://your-api-url.com

# MongoDB
MONGODB_URI=mongodb+srv://...

# Meta WhatsApp
META_ACCESS_TOKEN=...
META_PHONE_NUMBER_ID=...
META_BUSINESS_ACCOUNT_ID=...
META_WEBHOOK_VERIFY_TOKEN=...

# M-Pesa
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_PASSKEY=...
MPESA_SHORTCODE=174379

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Security
ENCRYPTION_KEY=...
JWT_SECRET=...
```

### Frontend
```env
VITE_API_URL=https://your-api-url.com
```

## Security Considerations

1. **Never commit .env files**
2. **Use strong encryption keys** (32+ characters)
3. **Enable webhook signature verification**
4. **Use HTTPS in production**
5. **Implement IP allowlisting** for webhooks
6. **Regular security audits**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Email: support@shaclaims.co.ke
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

## Acknowledgments

- Meta for WhatsApp Business API
- Safaricom for M-Pesa Daraja API
- MongoDB Atlas for database hosting
- Cloudinary for media storage
