## Foundation

BaseModel:
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)

/backend/common/models.py



## Users App

### Country (does NOT use BaseModel)
- id (AutoField, Primary Key)
- name (CharField, unique)
- code (CharField, unique)

### User (does NOT use BaseModel)
- id (AutoField, Primary Key)
- email (EmailField, unique)
- nickname (CharField)
- first_name (CharField)
- last_name (CharField)
- is_active (BooleanField)
- is_staff (BooleanField)
- date_joined (DateTimeField)
- email_verified (BooleanField)
- email_verified_at (DateTimeField, nullable)
- verification_attempts (IntegerField)
- last_verification_attempt (DateTimeField, nullable)
- groups (ManyToManyField to auth.Group)
- user_permissions (ManyToManyField to auth.Permission)

### AzughAccount (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- user (OneToOneField to User)
- phone_number (CharField, nullable)
- profile_picture (ImageField, nullable)
- gender (CharField, choices, nullable)
- date_of_birth (DateField, nullable)
- country (ForeignKey to Country, nullable)
- city (CharField, nullable)
- onboarding_completed (BooleanField)
- language (CharField, choices)

## Products App

### Shop (does NOT use BaseModel)
- id (AutoField, Primary Key)
- name (CharField, unique)
- base_url (URLField)

### Category (does NOT use BaseModel)
- id (AutoField, Primary Key)
- shop (ForeignKey to Shop)
- name (CharField)
- parent (TreeForeignKey to self, nullable)
- url (URLField, nullable)

### Brand (does NOT use BaseModel)
- id (AutoField, Primary Key)
- name (CharField, unique)

### Product (does NOT use BaseModel)
- id (AutoField, Primary Key)
- shop (ForeignKey to Shop)
- category (ForeignKey to Category)
- brand (ForeignKey to Brand)
- shop_product_id (CharField, nullable)
- url (URLField, unique)
- item_type (CharField, nullable)
- description (CharField)
- details (JSONField)
- about (TextField, nullable)
- price (DecimalField, nullable)
- currency (CharField)
- color (CharField, nullable)
- availability (JSONField, nullable)
- created_at (DateTimeField)
- updated_at (DateTimeField)
- is_embedded (BooleanField)

### ProductImage (does NOT use BaseModel)
- id (AutoField, Primary Key)
- product (ForeignKey to Product)
- image (ImageField, nullable)
- original_url (URLField)
- is_primary (BooleanField)

### CategoriesScrapingJob (does NOT use BaseModel)
- id (AutoField, Primary Key)
- shop (ForeignKey to Shop)
- start_time (DateTimeField)
- end_time (DateTimeField, nullable)
- status (CharField, choices)
- total_categories_scraped (IntegerField)
- total_new_categories (IntegerField)
- error_log (JSONField, nullable)

### ProductsScrapingJob (does NOT use BaseModel)
- id (AutoField, Primary Key)
- shop (ForeignKey to Shop)
- category (ForeignKey to Category, nullable)
- start_time (DateTimeField)
- end_time (DateTimeField, nullable)
- status (CharField, choices)
- total_products_scraped (IntegerField)
- total_new_products (IntegerField)
- error_log (JSONField, nullable)

### ImagesDownloadJob (does NOT use BaseModel)
- id (AutoField, Primary Key)
- shop (ForeignKey to Shop)
- category (ForeignKey to Category, nullable)
- start_time (DateTimeField)
- end_time (DateTimeField, nullable)
- status (CharField, choices)
- total_images_attempted (IntegerField)
- total_images_downloaded (IntegerField)
- error_log (JSONField, nullable)

## Profiles App

### PhysicalProfile (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- user (OneToOneField to User)
- height (DecimalField, nullable)
- weight (DecimalField, nullable)
- body_type (CharField, choices, nullable) # e.g., athletic, slim, curvy, plus-size
- skin_tone (CharField, nullable)

### SizeProfile (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- user (OneToOneField to User)
- chest (DecimalField, nullable)
- waist (DecimalField, nullable)
- hips (DecimalField, nullable)
- inseam (DecimalField, nullable)
- shoe_size (CharField, nullable)
- preferred_fit (CharField, choices, nullable) # e.g., tight, regular, loose

### AestheticsProfile (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- user (OneToOneField to User)
- preferred_aesthetics (ManyToManyField to Aesthetic)
- style_preferences (JSONField, nullable) # Additional flexible preferences
- color_palette (JSONField, nullable) # Preferred colors

## Aesthetics App

### Aesthetic (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- name (CharField, unique) # e.g., Minimalist, Streetwear, Vintage
- description (TextField)
- gender (CharField, choices) # male, female, both
- image (ImageField) # Visual representation of the aesthetic

## Sizing App

**Purpose:** Size standardization and conversion system

**Explanation:**
This app provides a comprehensive sizing system that handles conversions across different regional standards (US, UK, EU, JP, etc.) and product categories. The design allows for:
- Easy addition of new size standards
- Category-specific sizing rules (tops, bottoms, dresses, shoes have different sizing)
- Automatic size conversion when displaying products to users
- Measurement-based size recommendations

**Example:** A US size 8 dress = UK size 12 = EU size 38 = JP size 11

### SizeStandard (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- name (CharField, unique) # e.g., US, UK, EU, JP
- region (CharField) # Geographic region
- description (TextField, nullable)

### ProductCategory (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- name (CharField, unique) # e.g., tops, bottoms, dresses, shoes, outerwear
- description (TextField, nullable)

### SizeConversion (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- category (ForeignKey to ProductCategory) # Size conversions are category-specific
- from_standard (ForeignKey to SizeStandard, related_name='conversions_from')
- to_standard (ForeignKey to SizeStandard, related_name='conversions_to')
- from_size (CharField) # e.g., "8", "S", "38"
- to_size (CharField) # Equivalent size in target standard
- measurements (JSONField, nullable) # Optional: chest, waist, hips measurements for this size

**Note:** The combination of (category, from_standard, to_standard, from_size) should be unique

## Closet App

### ClosetItem (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- user (ForeignKey to User)
- product (ForeignKey to Product, nullable)
- custom_name (CharField, nullable)
- custom_description (TextField, nullable)
- brand (CharField, nullable)
- color (CharField, nullable)
- size (CharField, nullable)
- season (CharField, choices, nullable) 

### ClosetItemImage (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- closet_item (ForeignKey to ClosetItem)
- image (ImageField)
- is_primary (BooleanField)

### OutfitCombination (uses BaseModel) this is for future implementation
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- user (ForeignKey to User)
- name (CharField, nullable) # User-given name for the outfit
- items (ManyToManyField to ClosetItem)
- occasion (CharField, nullable) # e.g., casual, formal, work

## Shopping App

### Wishlist (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp) # Records when item was added to wishlist
- updated_at (Timestamp)
- user (ForeignKey to User)
- product (ForeignKey to Product)
- label (CharField, nullable) # e.g., "Birthday Gifts", "Winter Clothes"

### Cart (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp) # Records when item was added to cart
- updated_at (Timestamp)
- user (ForeignKey to User)
- product (ForeignKey to Product)
- quantity (IntegerField, default=1)
- selected_size (CharField, nullable)
- selected_color (CharField, nullable)

### Catalog (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp) # When recommendation was generated
- updated_at (Timestamp)
- user (ForeignKey to User)
- product (ForeignKey to Product)
- label (CharField) # e.g., "Paris Holiday", "Summer Essentials", "Work Wardrobe"
- score (DecimalField, nullable) # Algorithm confidence score
- reason (TextField, nullable) # Why this was recommended

**Note:** The combination of (user, product, label) should be unique to avoid duplicates

## Tracking App

### InteractionEvent (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- user (ForeignKey to User, nullable) # Nullable for anonymous users
- product (ForeignKey to Product, nullable) # Nullable for non-product events
- event_type (CharField, choices) # view, click, custom
- custom_event_name (CharField, nullable) # Only used when event_type='custom'
- metadata (JSONField, nullable) # Additional event data (e.g., duration, scroll depth)

### SearchQuery (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- user (ForeignKey to User, nullable) # Nullable for anonymous users
- query_text (TextField)
- filters_applied (JSONField, nullable) # Any filters used (category, price range, etc.)
- results_count (IntegerField)
- clicked_products (ManyToManyField to Product) # Products clicked from search results

## Subscriptions App

### SubscriptionPlan (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- name (CharField, unique) # e.g., Free, Premium, Enterprise
- description (TextField)
- price (DecimalField)
- currency (CharField, default='USD')
- billing_cycle (CharField, choices) # monthly, yearly
- is_active (BooleanField, default=True)

### SubscriptionFeature (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- plan (ForeignKey to SubscriptionPlan)
- feature_name (CharField) # e.g., "AI Recommendations", "Unlimited Closet Items"
- feature_value (CharField, nullable) # e.g., "100 per month", "Unlimited"
- is_enabled (BooleanField, default=True)

### UserSubscription (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp) # When subscription started
- updated_at (Timestamp)
- user (OneToOneField to User)
- plan (ForeignKey to SubscriptionPlan)
- status (CharField, choices) # active, cancelled, expired, trial
- current_period_start (DateTimeField)
- current_period_end (DateTimeField)
- cancel_at_period_end (BooleanField, default=False)
- trial_end (DateTimeField, nullable)

### SubscriptionHistory (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- user (ForeignKey to User)
- plan (ForeignKey to SubscriptionPlan)
- action (CharField, choices) # subscribed, upgraded, downgraded, cancelled, expired
- previous_plan (ForeignKey to SubscriptionPlan, nullable, related_name='previous_subscriptions')
- effective_date (DateTimeField)
- notes (TextField, nullable)

## Recommendations App

### RecommendationModel (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- version (CharField, unique) # Model version identifier
- algorithm_name (CharField) # e.g., "collaborative_filtering", "content_based"
- training_date (DateTimeField)
- performance_metrics (JSONField) # e.g., {"accuracy": 0.85, "precision": 0.82}
- is_active (BooleanField, default=False) # Only one model should be active at a time
- configuration (JSONField, nullable) # Model hyperparameters

### UserRecommendation (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp) # When recommendation was generated
- updated_at (Timestamp)
- user (ForeignKey to User)
- product (ForeignKey to Product)
- model (ForeignKey to RecommendationModel)
- score (DecimalField) # Recommendation confidence score
- reason (TextField, nullable) # Explanation for the recommendation
- is_shown (BooleanField, default=False) # Whether shown to user
- shown_at (DateTimeField, nullable)

**Note:** Recommendations complement the Catalog. While Catalog stores curated collections with labels, 
UserRecommendation tracks individual ML-generated suggestions with model versioning for A/B testing.

### RecommendationFeedback (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- recommendation (ForeignKey to UserRecommendation)
- user (ForeignKey to User)
- feedback_type (CharField, choices) # liked, dismissed, purchased, clicked
- notes (TextField, nullable)



