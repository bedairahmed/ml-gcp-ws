export type Language = "en" | "ar" | "ur";
export type UserRole = "admin" | "moderator" | "member" | "business";
export type AccountType = "community" | "business_owner";
export type TextDirection = "rtl" | "ltr";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  accountType: AccountType;
  groups: string[];
  photoURL?: string;
  language: Language;
  createdAt: any;
  lastSeen: any;
  isActive: boolean;
  isOnline: boolean;
  businessIds?: string[];
}

export interface Group {
  id: string;
  name_en: string;
  name_ar: string;
  name_ur: string;
  description_en: string;
  description_ar: string;
  description_ur: string;
  icon: string;
  color: string;
  memberCount: number;
  createdBy: string;
  createdAt: any;
  isDefault: boolean;
}

export interface ChatMessage {
  id: string;
  displayName: string;
  message: string;
  timestamp: any;
  userId: string;
  groupId: string;
  textDirection: TextDirection;
  isDeleted: boolean;
  deletedBy?: string;
  messageType: "text" | "emoji" | "islamic_phrase";
  replyTo?: {
    messageId: string;
    displayName: string;
    messagePreview: string;
  } | null;
  mentions: string[];
  reactions: Record<string, string[]>;
}

export interface DirectMessageConversation {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  participantPhotos: Record<string, string>;
  lastMessage: string;
  lastMessageTimestamp: any;
  lastMessageBy: string;
  unreadCount: Record<string, number>;
  createdAt: any;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: any;
  textDirection: TextDirection;
  isRead: boolean;
  messageType: "text" | "emoji" | "islamic_phrase";
  replyTo?: {
    messageId: string;
    displayName: string;
    messagePreview: string;
  } | null;
  mentions: string[];
  reactions: Record<string, string[]>;
}

export interface CommunityEvent {
  id: string;
  title_en: string;
  title_ar: string;
  title_ur: string;
  description_en: string;
  description_ar: string;
  description_ur: string;
  date: string;
  time: string;
  location: string;
  category: "jummah" | "education" | "social" | "youth" | "volunteer" | "ramadan";
  rsvpCount: number;
  rsvpUsers: string[];
  targetGroups: string[];
  createdBy: string;
  createdAt: any;
  isActive: boolean;
}

export interface Announcement {
  id: string;
  text_en: string;
  text_ar: string;
  text_ur: string;
  active: boolean;
  priority: number;
  createdBy: string;
  createdAt: any;
  expiresAt?: any;
}

export interface Business {
  id: string;
  name: string;
  name_ar?: string;
  name_ur?: string;
  description_en: string;
  description_ar: string;
  description_ur: string;
  category: string;
  subcategory?: string;
  ownerName: string;
  ownerUid: string;
  phone: string;
  email?: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: { lat: number; lng: number };
  hours: Record<string, { open: string; close: string; closed: boolean }>;
  tags: string[];
  photos: string[];
  averageRating: number;
  totalReviews: number;
  totalRatings: number;
  isVerified: boolean;
  isHalalCertified: boolean;
  isClaimed: boolean;
  claimedBy?: string;
  claimStatus: "none" | "pending" | "approved" | "rejected";
  addedBy: string;
  createdAt: any;
  updatedAt: any;
  isActive: boolean;
  isPremiumListing: boolean;
}

export interface BusinessReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  reviewText: string;
  language: Language;
  textDirection: TextDirection;
  createdAt: any;
  updatedAt: any;
  isEdited: boolean;
  helpfulCount: number;
  helpfulUsers: string[];
  response?: {
    text: string;
    respondedBy: string;
    respondedAt: any;
  } | null;
}

export interface BusinessClaim {
  id: string;
  businessId: string;
  businessName: string;
  userId: string;
  userName: string;
  userEmail: string;
  verificationMethod: "phone" | "email" | "document";
  verificationDetails: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: any;
  createdAt: any;
}

export type TranslationKey = string;
export type Translations = Record<Language, Record<string, string>>;
