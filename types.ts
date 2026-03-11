
export enum TechTag {
  MAKE = 'Make.com',
  N8N = 'n8n',
  ZAPIER = 'Zapier',
  PYTHON = 'Python',
  REACT = 'React',
  NODE = 'Node.js',
  NEXTJS = 'Next.js',
  OPENAI = 'OpenAI',
  CLAUDE = 'Claude',
  GOOGLE = 'Google Suite',
  SLACK = 'Slack',
  NOTION = 'Notion',
  HUBSPOT = 'HubSpot',
  SHOPIFY = 'Shopify',
  AIRTABLE = 'Airtable',
  WHATSAPP = 'WhatsApp'
}

export enum DeliveryMethod {
  FILE = 'File Download',
  LINK = 'Private Link',
  ACCESS = 'Access Instructions'
}

export enum PlanTier {
  FREE = 'free',
  STARTER = 'starter',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  isVisible: boolean;
  priority: number;
}

export enum OrderStatus {
  PENDING = 'Pending',
  AWAITING_VERIFICATION = 'Awaiting Verification',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  REFUNDED = 'Refunded'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  discountPrice?: number;
  categories: string[]; // Category IDs
  techTag: TechTag;
  imageUrl: string;
  features: string[];
  deliveryMethod: DeliveryMethod;
  deliveryContent: string;
  isPublished: boolean;
  // AutomateHub fields
  planAccessLevel?: PlanTier;
  isMonthlyDrop?: boolean;
  monthDropDate?: string;
  downloadCount?: number;
  tags?: string[];
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanTier;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  razorpaySubscriptionId?: string;
  amount: number;
}

export interface PurchaseRecord {
  id: string;
  userId: string;
  templateId: string;
  amount: number;
  paymentId: string;
  purchasedAt: string;
}

export interface MonthlyAddon {
  id: string;
  userId: string;
  month: string; // e.g. "2025-03"
  planTier: PlanTier;
  amountPaid: number;
  paymentId: string;
  paidAt: string;
}

export interface UserAccess {
  id: string;
  userId: string;
  templateId?: string;
  categoryId?: string;
  grantedByAdmin: boolean;
  grantedAt: string;
  expiresAt?: string;
  note?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentId?: string;
  screenshotUrl?: string;
  transactionId?: string;
  userEmail?: string;
  userFullName?: string;
  createdAt: string;
}

export enum RequestStatus {
  PENDING = 'pending',
  RESPONDED = 'responded',
  ARCHIVED = 'archived'
}

export interface CustomRequest {
  id: string;
  fullName: string;
  email: string;
  projectTitle: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
}

export const PLAN_CONFIG = {
  [PlanTier.STARTER]: {
    name: 'Starter',
    price: 499,
    period: 'year',
    addonPrice: 49,
    templateCount: 50,
    color: '#10B981',
    features: [
      '50+ curated templates',
      'Basic categories access',
      'Unlimited downloads',
      'Email support',
      'Monthly new drop (₹49 extra)'
    ]
  },
  [PlanTier.PRO]: {
    name: 'Pro',
    price: 999,
    period: 'year',
    addonPrice: 29,
    templateCount: 150,
    color: '#6C63FF',
    features: [
      '150+ premium templates',
      'All categories access',
      'Unlimited downloads',
      'Priority email support',
      'Early access to beta templates',
      'Monthly new drop (₹29 extra)'
    ]
  },
  [PlanTier.ENTERPRISE]: {
    name: 'Enterprise',
    price: 0,
    period: 'custom',
    addonPrice: 0,
    templateCount: Infinity,
    color: '#00D4FF',
    features: [
      'Full library access',
      'Custom AI agents',
      'Dedicated support',
      'Custom n8n workflow builds',
      'Team collaboration',
      'Priority SLA'
    ]
  }
};
