# SHA Claims Fixer - WhatsApp Message Templates

This document contains all the WhatsApp message templates required for the SHA Claims Fixer system.

## Template Requirements

All templates must be submitted to Meta for approval before they can be used. Approval typically takes 24-48 hours.

Submit templates at: [Meta Business Manager](https://business.facebook.com) → WhatsApp Manager → Message Templates

---

## 1. claim_received

**Purpose**: Acknowledge receipt of a new claim

**Category**: UTILITY

**Language**: English (en)

### Template JSON
```json
{
  "name": "claim_received",
  "language": "en",
  "category": "UTILITY",
  "components": [
    {
      "type": "BODY",
      "text": "Hello {{1}}, your claim {{2}} has been received. Our team will review it and get back to you shortly.",
      "example": {
        "body_text": [
          ["Nairobi West Hospital", "SHA-20240101-12345"]
        ]
      }
    },
    {
      "type": "FOOTER",
      "text": "SHA Claims Fixer - Automated Message"
    }
  ]
}
```

### Parameters
| Position | Description | Example |
|----------|-------------|---------|
| {{1}} | Hospital name | Nairobi West Hospital |
| {{2}} | Claim number | SHA-20240101-12345 |

---

## 2. payment_required

**Purpose**: Request payment for claim processing

**Category**: UTILITY

**Language**: English (en)

### Template JSON
```json
{
  "name": "payment_required",
  "language": "en",
  "category": "UTILITY",
  "components": [
    {
      "type": "BODY",
      "text": "Your claim {{1}} is ready for processing. Please complete the payment of {{2}} to receive the corrected document.",
      "example": {
        "body_text": [
          ["SHA-20240101-12345", "KES 300"]
        ]
      }
    },
    {
      "type": "FOOTER",
      "text": "An M-Pesa payment request will be sent shortly."
    }
  ]
}
```

### Parameters
| Position | Description | Example |
|----------|-------------|---------|
| {{1}} | Claim number | SHA-20240101-12345 |
| {{2}} | Amount with currency | KES 300 |

---

## 3. claim_ready

**Purpose**: Send corrected claim document to hospital

**Category**: UTILITY

**Language**: English (en)

### Template JSON
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
        "header_handle": [
          "https://res.cloudinary.com/example/raw/upload/v1234567890/sha-claims/hospitals/123456/claim-corrected.pdf"
        ]
      }
    },
    {
      "type": "BODY",
      "text": "Your corrected claim {{1}} is ready! Thank you for using SHA Claims Fixer.",
      "example": {
        "body_text": [
          ["SHA-20240101-12345"]
        ]
      }
    },
    {
      "type": "FOOTER",
      "text": "Reply within 24 hours for free support."
    }
  ]
}
```

### Parameters
| Position | Description | Example |
|----------|-------------|---------|
| {{1}} | Claim number | SHA-20240101-12345 |

---

## 4. weekly_retainer_reminder

**Purpose**: Remind hospitals about upcoming retainer renewal

**Category**: UTILITY

**Language**: English (en)

### Template JSON
```json
{
  "name": "weekly_retainer_reminder",
  "language": "en",
  "category": "UTILITY",
  "components": [
    {
      "type": "BODY",
      "text": "Hello {{1}}, your weekly retainer subscription expires on {{2}}. Renew now to continue enjoying unlimited claims processing.",
      "example": {
        "body_text": [
          ["Nairobi West Hospital", "January 15, 2024"]
        ]
      }
    },
    {
      "type": "FOOTER",
      "text": "Reply RENEW to renew your subscription."
    }
  ]
}
```

### Parameters
| Position | Description | Example |
|----------|-------------|---------|
| {{1}} | Hospital name | Nairobi West Hospital |
| {{2}} | Expiry date | January 15, 2024 |

---

## 5. payment_confirmation

**Purpose**: Confirm successful payment receipt

**Category**: UTILITY

**Language**: English (en)

### Template JSON
```json
{
  "name": "payment_confirmation",
  "language": "en",
  "category": "UTILITY",
  "components": [
    {
      "type": "BODY",
      "text": "Payment received! Your claim {{1}} is now being processed. M-Pesa Receipt: {{2}}. Amount: {{3}}.",
      "example": {
        "body_text": [
          ["SHA-20240101-12345", "QJ7H9K2L8M", "KES 300"]
        ]
      }
    },
    {
      "type": "FOOTER",
      "text": "Thank you for your payment."
    }
  ]
}
```

### Parameters
| Position | Description | Example |
|----------|-------------|---------|
| {{1}} | Claim number | SHA-20240101-12345 |
| {{2}} | M-Pesa receipt number | QJ7H9K2L8M |
| {{3}} | Amount with currency | KES 300 |

---

## 6. claim_rejected

**Purpose**: Notify hospital of claim rejection

**Category**: UTILITY

**Language**: English (en)

### Template JSON
```json
{
  "name": "claim_rejected",
  "language": "en",
  "category": "UTILITY",
  "components": [
    {
      "type": "BODY",
      "text": "Your claim {{1}} could not be processed. Reason: {{2}}. Please resubmit with the required corrections.",
      "example": {
        "body_text": [
          ["SHA-20240101-12345", "Missing patient membership number"]
        ]
      }
    },
    {
      "type": "FOOTER",
      "text": "Contact support for assistance."
    }
  ]
}
```

### Parameters
| Position | Description | Example |
|----------|-------------|---------|
| {{1}} | Claim number | SHA-20240101-12345 |
| {{2}} | Rejection reason | Missing patient membership number |

---

## 7. welcome_new_hospital

**Purpose**: Welcome message for newly registered hospitals

**Category**: UTILITY

**Language**: English (en)

### Template JSON
```json
{
  "name": "welcome_new_hospital",
  "language": "en",
  "category": "UTILITY",
  "components": [
    {
      "type": "BODY",
      "text": "Welcome to SHA Claims Fixer, {{1}}! Your account has been created. You can now submit claims by sending photos or documents. Your free tier includes 1 claim per month.",
      "example": {
        "body_text": [
          ["Nairobi West Hospital"]
        ]
      }
    },
    {
      "type": "FOOTER",
      "text": "Reply HELP for assistance."
    }
  ]
}
```

### Parameters
| Position | Description | Example |
|----------|-------------|---------|
| {{1}} | Hospital name | Nairobi West Hospital |

---

## API Usage Examples

### Send Template Message

```javascript
// Using the backend API
const response = await fetch('https://your-api-url.com/api/whatsapp/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    phoneNumber: '254712345678',
    message: {
      name: 'claim_received',
      language: { code: 'en' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: 'Nairobi West Hospital' },
            { type: 'text', text: 'SHA-20240101-12345' }
          ]
        }
      ]
    },
    type: 'template'
  })
});
```

### Using WhatsApp Service Directly

```javascript
import whatsappService from './services/whatsappService';

// Send claim received template
await whatsappService.sendClaimReceivedTemplate(
  '254712345678',
  'SHA-20240101-12345',
  'Nairobi West Hospital'
);

// Send payment required template
await whatsappService.sendPaymentRequiredTemplate(
  '254712345678',
  'SHA-20240101-12345',
  300
);

// Send claim ready template
await whatsappService.sendClaimReadyTemplate(
  '254712345678',
  'SHA-20240101-12345',
  'https://your-cdn.com/document.pdf'
);
```

---

## Best Practices

1. **Template Naming**: Use lowercase with underscores (snake_case)
2. **Categories**: Use UTILITY for transactional messages
3. **Language**: Use 'en' for English, add more languages as needed
4. **Parameters**: Keep parameters simple and clear
5. **Examples**: Always provide example values for faster approval
6. **Footer**: Include identifying information in footer

---

## Approval Tips

1. Be clear and concise in template descriptions
2. Use proper grammar and spelling
3. Avoid promotional language
4. Ensure examples match the parameter format
5. Test templates in sandbox before submission
6. Submit during business hours for faster approval
