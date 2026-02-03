// ============================================
// FRONTEND TYPE DEFINITIONS
// ============================================

export type ClaimStatus = 
  | 'received' 
  | 'analyzing' 
  | 'awaiting_payment' 
  | 'payment_received' 
  | 'processing' 
  | 'completed' 
  | 'rejected';

export type SubscriptionType = 'free' | 'per_claim' | 'weekly_retainer';
export type SubscriptionStatus = 'active' | 'inactive' | 'suspended';

export interface Hospital {
  _id: string;
  name: string;
  shaFacilityCode: string;
  phoneNumber: string;
  whatsappId: string;
  email: string;
  address: string;
  county: string;
  licenseNumber: string;
  contactPerson: {
    name: string;
    phone: string;
    email: string;
    role: string;
  };
  subscription: {
    type: SubscriptionType;
    status: SubscriptionStatus;
    startDate?: string;
    endDate?: string;
    claimsUsedThisMonth: number;
    claimsLimit: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Claim {
  _id: string;
  claimNumber: string;
  hospitalId: string;
  hospital?: Hospital;
  patientData: {
    patientNameHash: string;
    patientIdHash: string;
    membershipNumberHash: string;
    dateOfBirthEncrypted: string;
    gender: 'male' | 'female' | 'other';
  };
  originalDocuments: Array<{
    url: string;
    publicId: string;
    type: 'image' | 'pdf';
    filename: string;
    uploadedAt: string;
  }>;
  correctedDocuments: Array<{
    url: string;
    publicId: string;
    type: 'pdf';
    filename: string;
    uploadedAt: string;
    annotations: Annotation[];
  }>;
  diagnosisCodes: string[];
  procedureCodes: string[];
  status: ClaimStatus;
  analysisResult?: {
    errors: Array<{
      field: string;
      issue: string;
      suggestion: string;
    }>;
    confidence: number;
    processedAt: string;
  };
  payment: {
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
    mpesaReceiptNumber?: string;
    transactionDate?: string;
    checkoutRequestId?: string;
    merchantRequestId?: string;
  };
  whatsappConversationId?: string;
  submittedAt: string;
  completedAt?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Annotation {
  id: string;
  type: 'rect' | 'circle' | 'arrow' | 'text' | 'highlight';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  color: string;
  pageNumber: number;
  createdAt: string;
  createdBy: string;
}

export interface Conversation {
  _id: string;
  hospitalId: string;
  whatsappId: string;
  claimId?: string;
  hospital?: Hospital;
  claim?: Claim;
  messages: Array<{
    id: string;
    direction: 'inbound' | 'outbound';
    type: 'text' | 'image' | 'document' | 'template';
    content: string;
    mediaUrl?: string;
    templateName?: string;
    timestamp: string;
    delivered?: boolean;
    read?: boolean;
    messageId?: string;
  }>;
  sessionWindow: {
    startTime: string;
    endTime: string;
    isActive: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  hospitalId: string;
  claimId?: string;
  hospital?: Hospital;
  claim?: Claim;
  type: 'per_claim' | 'weekly_retainer' | 'bulk';
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  mpesaDetails: {
    phoneNumber: string;
    checkoutRequestId?: string;
    merchantRequestId?: string;
    receiptNumber?: string;
    transactionDate?: string;
    resultCode?: number;
    resultDesc?: string;
  };
  metadata?: {
    claimsCount?: number;
    periodStart?: string;
    periodEnd?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'analyst' | 'reviewer';
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalHospitals: number;
  activeHospitals: number;
  totalClaims: number;
  claimsByStatus: Record<ClaimStatus, number>;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  recentClaims: Claim[];
  recentConversations: Conversation[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
