/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "user_role_assignments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "user_role_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_role_requests" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "requestedRole" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "submissionData" JSONB NOT NULL,
    "adminNotes" TEXT,
    "rejection_reason" TEXT,
    "submitted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" DATETIME,
    "processed_by_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "user_role_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_role_requests_processed_by_id_fkey" FOREIGN KEY ("processed_by_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "geo_zones" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "description_en" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "geo_cities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "zone_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "description_en" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "geo_cities_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "geo_zones" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "geo_regions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "city_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "description_en" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "geo_regions_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "geo_cities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT,
    "phone_number" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_role_history_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "changed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changed_by_id" INTEGER NOT NULL,
    "reason" TEXT,
    "profile_id" INTEGER,
    CONSTRAINT "user_role_history_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_role_history_items_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_login_sessions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "device_type" TEXT DEFAULT 'BROWSER',
    "device_name" TEXT,
    "device_model" TEXT,
    "imei" TEXT,
    "expires_at" DATETIME NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "user_login_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_notifications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "message_en" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "system_staff_profiles" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role_id" INTEGER NOT NULL,
    "employee_id" TEXT,
    "joined_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" DATETIME,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "system_staff_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "system_staff_profiles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "system_staff_roles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "system_staff_roles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role_name" TEXT NOT NULL,
    "role_name_en" TEXT NOT NULL,
    "description" TEXT,
    "description_en" TEXT,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "permission_key" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "category_en" TEXT NOT NULL,
    "description" TEXT,
    "description_en" TEXT,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "system_staff_role_permissions" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    PRIMARY KEY ("role_id", "permission_id"),
    CONSTRAINT "system_staff_role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "system_staff_roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "system_staff_role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_devices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "device_type" TEXT NOT NULL,
    "device_name" TEXT,
    "device_model" TEXT,
    "imei" TEXT,
    "fcm_token" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_used_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "first_seen_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "user_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "customer_profiles" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "default_address_id" INTEGER,
    "language" TEXT NOT NULL DEFAULT 'ar',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "customer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "customer_profiles_default_address_id_fkey" FOREIGN KEY ("default_address_id") REFERENCES "customer_addresses" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "customer_addresses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT,
    "city_id" INTEGER,
    "region_id" INTEGER,
    "postal_code" TEXT,
    "notes" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "customer_addresses_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "customer_addresses_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "geo_cities" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "customer_addresses_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "geo_regions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "wishlist_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "added_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "wishlist_items_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "wishlist_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "e_products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vendor_profiles" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "store_name" TEXT NOT NULL,
    "store_name_en" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "description_en" TEXT,
    "logo" TEXT,
    "banner" TEXT,
    "email" TEXT,
    "phone_number" TEXT,
    "whats_app" TEXT,
    "website" TEXT,
    "zone_id" INTEGER,
    "city_id" INTEGER,
    "region_id" INTEGER,
    "address" TEXT,
    "commission_rate" DECIMAL NOT NULL DEFAULT 10,
    "min_payout" DECIMAL NOT NULL DEFAULT 100,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "vendor_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "vendor_profiles_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "geo_zones" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "vendor_profiles_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "geo_cities" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "vendor_profiles_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "geo_regions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vendor_balances" (
    "vendor_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "available_balance" DECIMAL NOT NULL DEFAULT 0,
    "pending_balance" DECIMAL NOT NULL DEFAULT 0,
    "total_sales" DECIMAL NOT NULL DEFAULT 0,
    "total_commission" DECIMAL NOT NULL DEFAULT 0,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "vendor_balances_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vendor_transactions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vendor_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "fee" DECIMAL NOT NULL DEFAULT 0,
    "net_amount" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "reference" TEXT,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "vendor_transactions_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_balances" ("vendor_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vendor_payouts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vendor_id" INTEGER NOT NULL,
    "amount" DECIMAL NOT NULL,
    "fee" DECIMAL NOT NULL DEFAULT 0,
    "net_amount" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "payment_method" TEXT NOT NULL,
    "payment_details" JSONB,
    "notes" TEXT,
    "processed_by_id" INTEGER,
    "processed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "vendor_payouts_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_balances" ("vendor_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "delivery_person_profiles" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vehicle_type" TEXT NOT NULL,
    "vehicle_plate_number" TEXT,
    "license_number" TEXT,
    "id_number" TEXT,
    "zone_id" INTEGER,
    "city_id" INTEGER,
    "region_id" INTEGER,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_date" DATETIME,
    "rating" DECIMAL,
    "completed_deliveries" INTEGER NOT NULL DEFAULT 0,
    "joined_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "delivery_person_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "delivery_person_profiles_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "geo_zones" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "delivery_person_profiles_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "geo_cities" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "delivery_person_profiles_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "geo_regions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "deliveries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "delivery_person_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "assigned_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "picked_up_at" DATETIME,
    "estimated_delivery_time" DATETIME,
    "actual_delivery_time" DATETIME,
    "pickup_location" JSONB,
    "dropoff_location" JSONB NOT NULL,
    "current_location" JSONB,
    "recipient_name" TEXT NOT NULL,
    "recipient_phone" TEXT NOT NULL,
    "delivery_notes" TEXT,
    "rating" INTEGER,
    "feedback" TEXT,
    "delivery_fee" DECIMAL NOT NULL DEFAULT 0,
    "cash_on_delivery" DECIMAL NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "deliveries_delivery_person_id_fkey" FOREIGN KEY ("delivery_person_id") REFERENCES "delivery_person_profiles" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "deliveries_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "e_orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "e_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "description_en" TEXT,
    "image_url" TEXT,
    "icon_url" TEXT,
    "banner_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "show_in_menu" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "e_subcategories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "description" TEXT,
    "description_en" TEXT,
    "image_url" TEXT,
    "icon_url" TEXT,
    "banner_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "show_in_menu" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "e_subcategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "e_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "e_brands" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo_url" TEXT,
    "description" TEXT,
    "description_en" TEXT,
    "website_url" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "e_products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vendor_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "subcategory_id" INTEGER,
    "brand_id" INTEGER,
    "name" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sku" TEXT,
    "barcode" TEXT,
    "description" TEXT,
    "description_en" TEXT,
    "short_desc" TEXT,
    "short_desc_en" TEXT,
    "price" DECIMAL NOT NULL,
    "compare_price" DECIMAL,
    "cost_price" DECIMAL NOT NULL,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "low_stock_alert" INTEGER,
    "track_inventory" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "e_products_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "e_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "e_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "e_products_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "e_subcategories" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "e_products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "e_brands" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "e_product_images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "file_upload_id" INTEGER NOT NULL,
    "alt" TEXT,
    "title" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "e_product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "e_products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "e_product_images_file_upload_id_fkey" FOREIGN KEY ("file_upload_id") REFERENCES "file_uploads" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "e_product_attributes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "is_variant" BOOLEAN NOT NULL DEFAULT true,
    "attribute_type" TEXT NOT NULL DEFAULT 'TEXT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "e_product_attributes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "e_products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "e_product_variations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "sku" TEXT,
    "price" DECIMAL NOT NULL,
    "compare_price" DECIMAL,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "e_product_variations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "e_products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "e_product_variation_attributes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "variation_id" INTEGER NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "value_en" TEXT,
    "color_hex" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "e_product_variation_attributes_variation_id_fkey" FOREIGN KEY ("variation_id") REFERENCES "e_product_variations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "e_product_variation_attributes_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "e_product_attributes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "e_product_reviews" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "order_id" INTEGER,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "title" TEXT,
    "comment" TEXT,
    "is_verified_purchase" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "e_product_reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "e_products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "e_product_reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "e_product_reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "e_orders" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "e_carts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "e_carts_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "e_cart_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cart_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "variation_id" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "e_cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "e_carts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "e_cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "e_products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "e_cart_items_variation_id_fkey" FOREIGN KEY ("variation_id") REFERENCES "e_product_variations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "e_orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_number" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "subtotal" DECIMAL NOT NULL,
    "shipping" DECIMAL NOT NULL DEFAULT 0,
    "tax" DECIMAL NOT NULL DEFAULT 0,
    "discount" DECIMAL NOT NULL DEFAULT 0,
    "total" DECIMAL NOT NULL,
    "coupon_code" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "payment_status" TEXT NOT NULL DEFAULT 'UNPAID',
    "payment_method" TEXT,
    "shipping_method" TEXT,
    "shipping_address" JSONB,
    "tracking_number" TEXT,
    "customer_notes" TEXT,
    "vendor_notes" TEXT,
    "placed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paid_at" DATETIME,
    "processed_at" DATETIME,
    "shipped_at" DATETIME,
    "delivered_at" DATETIME,
    "cancelled_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "e_orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer_profiles" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "e_orders_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor_profiles" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "e_order_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "variation_id" INTEGER,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "price" DECIMAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subtotal" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "e_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "e_orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "e_order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "e_products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "e_order_items_variation_id_fkey" FOREIGN KEY ("variation_id") REFERENCES "e_product_variations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "e_order_status_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "created_by_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "e_order_status_history_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "e_orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "file_uploads" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "original_name" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "user_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "file_uploads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "old_value" JSONB,
    "new_value" JSONB,
    "ip_address" TEXT,
    "request_path" TEXT,
    "user_agent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "notes" TEXT,
    CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "system_settings" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "data_type" TEXT NOT NULL,
    "is_secret" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "description_en" TEXT,
    "updated_by_id" INTEGER,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OtpVerification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phoneNumber" TEXT NOT NULL,
    "otpCode" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" DATETIME NOT NULL,
    "verifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "user_role_assignments_user_id_is_active_idx" ON "user_role_assignments"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "user_role_assignments_user_id_is_primary_idx" ON "user_role_assignments"("user_id", "is_primary");

-- CreateIndex
CREATE UNIQUE INDEX "user_role_assignments_user_id_role_key" ON "user_role_assignments"("user_id", "role");

-- CreateIndex
CREATE INDEX "user_role_requests_user_id_idx" ON "user_role_requests"("user_id");

-- CreateIndex
CREATE INDEX "user_role_requests_requestedRole_idx" ON "user_role_requests"("requestedRole");

-- CreateIndex
CREATE INDEX "user_role_requests_status_idx" ON "user_role_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "geo_zones_name_key" ON "geo_zones"("name");

-- CreateIndex
CREATE UNIQUE INDEX "geo_zones_code_key" ON "geo_zones"("code");

-- CreateIndex
CREATE INDEX "geo_zones_is_active_idx" ON "geo_zones"("is_active");

-- CreateIndex
CREATE INDEX "geo_cities_is_active_idx" ON "geo_cities"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "geo_cities_zone_name_unique" ON "geo_cities"("zone_id", "name");

-- CreateIndex
CREATE INDEX "geo_regions_is_active_idx" ON "geo_regions"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "geo_regions_city_name_unique" ON "geo_regions"("city_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE INDEX "users_phone_number_idx" ON "users"("phone_number");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "users"("is_active");

-- CreateIndex
CREATE INDEX "user_role_history_items_user_id_changed_at_idx" ON "user_role_history_items"("user_id", "changed_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "user_login_sessions_token_key" ON "user_login_sessions"("token");

-- CreateIndex
CREATE INDEX "user_login_sessions_user_id_idx" ON "user_login_sessions"("user_id");

-- CreateIndex
CREATE INDEX "user_login_sessions_token_idx" ON "user_login_sessions"("token");

-- CreateIndex
CREATE INDEX "user_login_sessions_expires_at_idx" ON "user_login_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "user_login_sessions_device_type_idx" ON "user_login_sessions"("device_type");

-- CreateIndex
CREATE INDEX "user_login_sessions_imei_idx" ON "user_login_sessions"("imei");

-- CreateIndex
CREATE INDEX "user_login_sessions_isValid_idx" ON "user_login_sessions"("isValid");

-- CreateIndex
CREATE INDEX "user_notifications_user_id_is_read_idx" ON "user_notifications"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "user_notifications_type_idx" ON "user_notifications"("type");

-- CreateIndex
CREATE UNIQUE INDEX "system_staff_profiles_employee_id_key" ON "system_staff_profiles"("employee_id");

-- CreateIndex
CREATE INDEX "system_staff_profiles_is_active_idx" ON "system_staff_profiles"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "system_staff_roles_role_name_key" ON "system_staff_roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_permission_key_key" ON "permissions"("permission_key");

-- CreateIndex
CREATE INDEX "permissions_category_idx" ON "permissions"("category");

-- CreateIndex
CREATE INDEX "user_devices_user_id_idx" ON "user_devices"("user_id");

-- CreateIndex
CREATE INDEX "user_devices_device_type_idx" ON "user_devices"("device_type");

-- CreateIndex
CREATE INDEX "user_devices_imei_idx" ON "user_devices"("imei");

-- CreateIndex
CREATE INDEX "user_devices_is_active_idx" ON "user_devices"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "user_device_unique_imei" ON "user_devices"("user_id", "imei");

-- CreateIndex
CREATE UNIQUE INDEX "customer_profiles_default_address_id_key" ON "customer_profiles"("default_address_id");

-- CreateIndex
CREATE INDEX "customer_profiles_is_active_idx" ON "customer_profiles"("is_active");

-- CreateIndex
CREATE INDEX "customer_addresses_customer_id_idx" ON "customer_addresses"("customer_id");

-- CreateIndex
CREATE INDEX "customer_addresses_is_default_idx" ON "customer_addresses"("is_default");

-- CreateIndex
CREATE INDEX "wishlist_items_customer_id_idx" ON "wishlist_items"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_customer_id_product_id_key" ON "wishlist_items"("customer_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_profiles_user_id_key" ON "vendor_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_profiles_slug_key" ON "vendor_profiles"("slug");

-- CreateIndex
CREATE INDEX "vendor_profiles_is_active_status_idx" ON "vendor_profiles"("is_active", "status");

-- CreateIndex
CREATE INDEX "vendor_profiles_is_verified_idx" ON "vendor_profiles"("is_verified");

-- CreateIndex
CREATE INDEX "vendor_profiles_slug_idx" ON "vendor_profiles"("slug");

-- CreateIndex
CREATE INDEX "vendor_transactions_vendor_id_idx" ON "vendor_transactions"("vendor_id");

-- CreateIndex
CREATE INDEX "vendor_transactions_type_idx" ON "vendor_transactions"("type");

-- CreateIndex
CREATE INDEX "vendor_transactions_status_idx" ON "vendor_transactions"("status");

-- CreateIndex
CREATE INDEX "vendor_transactions_created_at_idx" ON "vendor_transactions"("created_at");

-- CreateIndex
CREATE INDEX "vendor_payouts_vendor_id_idx" ON "vendor_payouts"("vendor_id");

-- CreateIndex
CREATE INDEX "vendor_payouts_status_idx" ON "vendor_payouts"("status");

-- CreateIndex
CREATE INDEX "vendor_payouts_created_at_idx" ON "vendor_payouts"("created_at");

-- CreateIndex
CREATE INDEX "delivery_person_profiles_is_active_is_available_idx" ON "delivery_person_profiles"("is_active", "is_available");

-- CreateIndex
CREATE INDEX "deliveries_delivery_person_id_idx" ON "deliveries"("delivery_person_id");

-- CreateIndex
CREATE INDEX "deliveries_order_id_idx" ON "deliveries"("order_id");

-- CreateIndex
CREATE INDEX "deliveries_status_idx" ON "deliveries"("status");

-- CreateIndex
CREATE UNIQUE INDEX "e_categories_slug_key" ON "e_categories"("slug");

-- CreateIndex
CREATE INDEX "e_categories_is_active_idx" ON "e_categories"("is_active");

-- CreateIndex
CREATE INDEX "e_categories_is_active_is_featured_idx" ON "e_categories"("is_active", "is_featured");

-- CreateIndex
CREATE INDEX "e_categories_slug_idx" ON "e_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "e_subcategories_slug_key" ON "e_subcategories"("slug");

-- CreateIndex
CREATE INDEX "e_subcategories_category_id_is_active_idx" ON "e_subcategories"("category_id", "is_active");

-- CreateIndex
CREATE INDEX "e_subcategories_is_active_is_featured_idx" ON "e_subcategories"("is_active", "is_featured");

-- CreateIndex
CREATE UNIQUE INDEX "subcategory_unique_slug" ON "e_subcategories"("category_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "e_brands_slug_key" ON "e_brands"("slug");

-- CreateIndex
CREATE INDEX "e_brands_is_active_featured_idx" ON "e_brands"("is_active", "featured");

-- CreateIndex
CREATE INDEX "e_brands_slug_idx" ON "e_brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "e_products_slug_key" ON "e_products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "e_products_sku_key" ON "e_products"("sku");

-- CreateIndex
CREATE INDEX "e_products_vendor_id_idx" ON "e_products"("vendor_id");

-- CreateIndex
CREATE INDEX "e_products_category_id_idx" ON "e_products"("category_id");

-- CreateIndex
CREATE INDEX "e_products_subcategory_id_idx" ON "e_products"("subcategory_id");

-- CreateIndex
CREATE INDEX "e_products_is_active_is_published_idx" ON "e_products"("is_active", "is_published");

-- CreateIndex
CREATE INDEX "e_products_is_active_is_featured_idx" ON "e_products"("is_active", "is_featured");

-- CreateIndex
CREATE INDEX "e_product_images_product_id_idx" ON "e_product_images"("product_id");

-- CreateIndex
CREATE INDEX "e_product_images_is_default_idx" ON "e_product_images"("is_default");

-- CreateIndex
CREATE INDEX "e_product_attributes_product_id_idx" ON "e_product_attributes"("product_id");

-- CreateIndex
CREATE INDEX "e_product_variations_product_id_idx" ON "e_product_variations"("product_id");

-- CreateIndex
CREATE INDEX "e_product_variations_is_active_idx" ON "e_product_variations"("is_active");

-- CreateIndex
CREATE INDEX "e_product_variation_attributes_attribute_id_idx" ON "e_product_variation_attributes"("attribute_id");

-- CreateIndex
CREATE INDEX "e_product_variation_attributes_value_idx" ON "e_product_variation_attributes"("value");

-- CreateIndex
CREATE UNIQUE INDEX "e_product_variation_attributes_variation_id_attribute_id_key" ON "e_product_variation_attributes"("variation_id", "attribute_id");

-- CreateIndex
CREATE INDEX "e_product_reviews_product_id_idx" ON "e_product_reviews"("product_id");

-- CreateIndex
CREATE INDEX "e_product_reviews_customer_id_idx" ON "e_product_reviews"("customer_id");

-- CreateIndex
CREATE INDEX "e_product_reviews_rating_idx" ON "e_product_reviews"("rating");

-- CreateIndex
CREATE INDEX "e_product_reviews_status_idx" ON "e_product_reviews"("status");

-- CreateIndex
CREATE UNIQUE INDEX "e_carts_customer_id_key" ON "e_carts"("customer_id");

-- CreateIndex
CREATE INDEX "e_carts_customer_id_idx" ON "e_carts"("customer_id");

-- CreateIndex
CREATE INDEX "e_cart_items_cart_id_idx" ON "e_cart_items"("cart_id");

-- CreateIndex
CREATE INDEX "e_cart_items_product_id_idx" ON "e_cart_items"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "e_cart_items_cart_id_product_id_key" ON "e_cart_items"("cart_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "e_orders_order_number_key" ON "e_orders"("order_number");

-- CreateIndex
CREATE INDEX "e_orders_customer_id_idx" ON "e_orders"("customer_id");

-- CreateIndex
CREATE INDEX "e_orders_vendor_id_idx" ON "e_orders"("vendor_id");

-- CreateIndex
CREATE INDEX "e_orders_status_idx" ON "e_orders"("status");

-- CreateIndex
CREATE INDEX "e_orders_payment_status_idx" ON "e_orders"("payment_status");

-- CreateIndex
CREATE INDEX "e_orders_created_at_idx" ON "e_orders"("created_at");

-- CreateIndex
CREATE INDEX "e_order_items_order_id_idx" ON "e_order_items"("order_id");

-- CreateIndex
CREATE INDEX "e_order_items_product_id_idx" ON "e_order_items"("product_id");

-- CreateIndex
CREATE INDEX "e_order_status_history_order_id_idx" ON "e_order_status_history"("order_id");

-- CreateIndex
CREATE INDEX "file_uploads_entity_type_entity_id_idx" ON "file_uploads"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "file_uploads_user_id_idx" ON "file_uploads"("user_id");

-- CreateIndex
CREATE INDEX "file_uploads_is_public_idx" ON "file_uploads"("is_public");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_status_idx" ON "audit_logs"("status");

-- CreateIndex
CREATE INDEX "OtpVerification_phoneNumber_type_idx" ON "OtpVerification"("phoneNumber", "type");

-- CreateIndex
CREATE INDEX "OtpVerification_phoneNumber_otpCode_type_idx" ON "OtpVerification"("phoneNumber", "otpCode", "type");
