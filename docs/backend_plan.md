# Django Backend Organization Guide

## Overview

This document defines the Django app structure for the AzughAI fashion platform. The architecture follows Django best practices with clear separation of concerns and single responsibility per app.

## App Structure

```python
INSTALLED_APPS = [
    # Core Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Project apps
    'users',           # Authentication & authorization
    'profiles',        # User profile data (physical, size, aesthetics)
    'aesthetics',      # Master aesthetic definitions
    'sizing',          # Size standards and conversions
    'closet',          # User wardrobe and uploads
    'shopping',        # Wishlist, catalog, cart
    'tracking',        # User activity analytics
    'subscriptions',   # Subscription management
    'products',        # Product scraping and management
    'agent',           # AI agent functionality
    'recommendations', # ML-based product recommendation engine
]
```

## App Definitions

### 1. users
**Purpose:** Handle authentication and authorization only

**Responsibilities:**
- User authentication (login, logout, registration)
- Password management
- Permissions and groups
- Token management

**Key Models:**
- `User` (Django's AbstractUser or custom)

**Why Separate:** Keeps auth logic isolated from user attributes and preferences.

---

### 2. profiles
**Purpose:** Manage all user-related profile data

**Models:**
- `PhysicalProfile` - Physical attributes (height, weight, body_type, skin_tone)
- `SizeProfile` - Measurements (chest, waist, hips, inseam, shoe_size, preferred_fit)
- `AestheticsProfile` - Style preferences (preferred_aesthetics, style_preferences, color_palette)

**Relationships:**
- Each profile model has `OneToOneField` to `User`
- `AestheticsProfile.preferred_aesthetics` → `ManyToManyField` to `aesthetics.Aesthetic`

**Key Features:**
- All profile fields are nullable for progressive onboarding
- JSONField for flexible preference storage
- Timestamps for tracking profile updates

---

### 3. aesthetics
**Purpose:** Master data for aesthetic styles used across the platform

**Models:**
- `Aesthetic` - Core aesthetic definitions (name, description, style_keywords, color_palette)
- `AestheticCategory` - Categories (casual, formal, streetwear, vintage, minimalist)

**Relationships:**
- Referenced by `profiles.AestheticsProfile`
- Can be tagged to `products.Product`

**Why Separate:** Centralized aesthetic definitions ensure consistency across user preferences and product categorization.

---

### 4. sizing
**Purpose:** Size standardization and conversion rules

**Models:**
- `SizeStandard` - Size systems (US, UK, EU, JP)
- `SizeConversion` - Conversion rules between standards
- `CategorySizing` - Sizing rules per product category (tops, bottoms, shoes)

**Key Features:**
- Supports multi-region sizing
- Category-specific conversion logic
- Maintains size chart data

**Why Separate:** Complex sizing logic deserves dedicated space for maintainability.

---

### 5. closet
**Purpose:** User's personal wardrobe management

**Models:**
- `ClosetItem` - User-owned products (linked to products or custom)
- `UploadedItem` - User-uploaded images with AI analysis results
- `OutfitCombination` - Saved outfit combinations

**Relationships:**
- `ClosetItem.product` → `ForeignKey` to `products.Product` (nullable)
- `ClosetItem.user` → `ForeignKey` to `User`
- `OutfitCombination.items` → `ManyToManyField` to `ClosetItem`

**Key Features:**
- Image upload and storage
- AI-powered item analysis
- Outfit creation and management

---

### 6. shopping
**Purpose:** Shopping and discovery features

**Models:**
- `Wishlist` - Items user wants to buy
- `Catalog` - AI-suggested products for user
- `Cart` - Items ready for purchase
- `SavedSearch` - Saved search queries and filters

**Relationships:**
- All models link to `User` and `products.Product`
- `ManyToManyField` for product collections

**Key Features:**
- Separate collections for different shopping stages
- Support for saved filters and preferences
- AI-driven catalog recommendations

---

### 7. tracking
**Purpose:** User activity and analytics

**Models:**
- `ProductView` - Product page views
- `ProductClick` - Clicks on products
- `SearchQuery` - Search history
- `UserSession` - Session tracking
- `InteractionEvent` - Generic event tracking

**Relationships:**
- All events link to `User` (nullable for anonymous)
- Product-related events link to `products.Product`

**Key Features:**
- Timestamped events
- Support for anonymous tracking
- Aggregate analytics support

**Why Separate:** Keeps analytics isolated for performance and data management.

---

### 8. subscriptions
**Purpose:** Subscription and billing management

**Models:**
- `SubscriptionPlan` - Available plans (free, premium, enterprise)
- `UserSubscription` - User's active subscription
- `SubscriptionHistory` - Subscription change log
- `SubscriptionFeature` - Feature access control per plan

**Relationships:**
- `UserSubscription.user` → `OneToOneField` to `User`
- `UserSubscription.plan` → `ForeignKey` to `SubscriptionPlan`

**Key Features:**
- Billing cycle management
- Feature gating
- Upgrade/downgrade handling
- Payment history

---

### 9. products (existing)
**Purpose:** Product data management and scraping

**Responsibilities:**
- Web scraping from fashion retailers
- Product data normalization
- Product search and filtering

---

### 10. agent (existing)
**Purpose:** AI agent functionality

**Responsibilities:**
- AI-powered recommendations
- Style analysis
- Personalization engine

---

### 11. recommendations
**Purpose:** ML-based product recommendation engine

**Models:**
- `RecommendationModel` - Metadata about trained ML models (version, training_date, performance_metrics)
- `UserRecommendation` - Generated recommendations for users (product, score, reason, generated_at)
- `RecommendationFeedback` - User feedback on recommendations (liked, dismissed, purchased)
- `TrainingDataset` - References to training data snapshots

**Relationships:**
- `UserRecommendation.user` → `ForeignKey` to `User`
- `UserRecommendation.product` → `ForeignKey` to `products.Product`
- `UserRecommendation.model` → `ForeignKey` to `RecommendationModel`
- `RecommendationFeedback.recommendation` → `ForeignKey` to `UserRecommendation`

**Key Features:**
- ML model versioning and A/B testing
- Personalized recommendation generation
- Feedback loop for model improvement
- Recommendation explanation/reasoning
- Batch and real-time recommendation generation

**Why Separate from `agent`:**
- `agent` handles conversational AI and general style analysis
- `recommendations` focuses specifically on ML-driven product matching
- Allows independent model training pipelines
- Separate scaling (recommendations are compute-intensive)
- Clear boundary between recommendation logic and agent interactions

**Integration Points:**
- Consumes data from `tracking` (user behavior)
- Consumes data from `profiles` (user preferences)
- Consumes data from `closet` (owned items for similarity)
- Populates `shopping.Catalog` with recommended products
- Used by `agent` to provide personalized suggestions

## Design Principles

1. **Separation of Concerns:** Each app has a single, well-defined purpose
2. **Scalability:** Easy to extend features within domain boundaries
3. **Maintainability:** Clear app boundaries reduce complexity
4. **Reusability:** Apps like `sizing` and `aesthetics` are referenced across features
5. **Testability:** Isolated apps enable focused unit testing

## Cross-App Relationships

