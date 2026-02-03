require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage (temporary - replace with MongoDB later)
const hospitals = [];
const claims = [];
let claimIdCounter = 1;

console.log('Server running in MEMORY MODE (MongoDB disabled due to DNS issues)');
console.log('Data will be lost when server restarts - this is for testing only');

// Helper: Find or create hospital
async function findOrCreateHospital(phoneNumber) {
  let hospital = hospitals.find(h => h.phoneNumber === phoneNumber);
  if (!hospital) {
    hospital = {
      _id: Date.now().toString(),
      phoneNumber: phoneNumber,
      name: `Hospital_${phoneNumber}`,
      subscriptionType: 'pay_per_claim',
      createdAt: new Date()
    };
    hospitals.push(hospital);
    console.log(`New hospital created: ${hospital.name}`);
  }
  return hospital;
}

// Helper: Create claim
async function createClaim(hospitalPhone, hospitalId, imageUrl) {
  const claim = {
    _id: claimIdCounter++,
    hospitalPhone: hospitalPhone,
    hospitalId: hospitalId,
    originalImageUrl: imageUrl,
    correctedDocumentUrl: null,
    status: 'received',
    amount: 300,
    paymentStatus: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  claims.push(claim);
  console.log(`New claim created: #${claim._id}`);
  return claim;
}

// META WHATSAPP WEBHOOK VERIFICATION
app.get('/webhooks/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Webhook verification:', { mode, token });

  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    console.error('Verification failed');
    res.sendStatus(403);
  }
});

// META WHATSAPP INCOMING MESSAGES
app.post('/webhooks/whatsapp', async (req, res) => {
  try {
    console.log('Incoming WhatsApp:', JSON.stringify(req.body, null, 2));
    res.sendStatus(200); // Acknowledge immediately

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    
    if (!value?.messages) return;

    const message = value.messages[0];
    const from = message.from;
    const type = message.type;

    const hospital = await findOrCreateHospital(from);

    if (type === 'image') {
      const imageId = message.image.id;
      
      // Skip media download for now (needs valid Meta token)
      const imageUrl = `https://graph.facebook.com/v18.0/${imageId}`;
      
      const claim = await createClaim(from, hospital._id, imageUrl);
      
      // Send confirmation (will fail without valid Meta token, but logs will show)
      await sendWhatsAppText(from, `Claim #${claim._id} received! We'll analyze it and get back to you.`);
    }
    else if (type === 'text') {
      const text = message.text.body.toLowerCase();
      
      if (text.includes('status')) {
        const hospitalClaims = claims.filter(c => c.hospitalPhone === from).slice(-3);
        let response = "Your recent claims:\n";
        hospitalClaims.forEach(c => {
          response += `#${c._id}: ${c.status}\n`;
        });
        await sendWhatsAppText(from, response);
      } else {
        await sendWhatsAppText(from, "Send a photo of your rejected SHA claim document.");
      }
    }

  } catch (error) {
    console.error('Webhook error:', error.message);
  }
});

// Helper: Send WhatsApp message
async function sendWhatsAppText(to, text) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.META_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: { body: text }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('WhatsApp sent:', response.data.messages?.[0]?.id);
  } catch (error) {
    console.error('WhatsApp failed:', error.response?.data?.error?.message || error.message);
    // Continue even if message fails - we're testing the webhook
  }
}

// Admin API Routes
app.get('/api/claims', (req, res) => {
  res.json(claims);
});

app.get('/api/hospitals', (req, res) => {
  res.json(hospitals);
});

app.patch('/api/claims/:id/status', (req, res) => {
  const claim = claims.find(c => c._id == req.params.id);
  if (claim) {
    claim.status = req.body.status;
    claim.correctedDocumentUrl = req.body.correctedUrl;
    claim.updatedAt = new Date();
  }
  res.json(claim);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    mode: 'MEMORY (MongoDB disabled)',
    timestamp: new Date(),
    claimsCount: claims.length,
    hospitalsCount: hospitals.length
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📱 Webhook: http://localhost:${PORT}/webhooks/whatsapp`);
  console.log(`💾 Memory mode: Data clears on restart\n`);
});