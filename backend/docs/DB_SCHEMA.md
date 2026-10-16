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

### ClosedItemImage (uses BaseModel)
- id (UUID, Primary Key)
- created_at (Timestamp)
- updated_at (Timestamp)
- closet_item (ForeignKey to ClosetItem)
- image (ImageField)
- is_primary (BooleanField)



