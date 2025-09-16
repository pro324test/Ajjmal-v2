# Database Seeding for Ajjmal-v2

This repository includes database seeding functionality to provide test users for login testing.

## Available Test Users

All users have the password: **123Qwe**

### 1. System Administrator
- **Email:** `admin@ecme.com`
- **Phone:** `+218911234567`
- **Role:** SYSTEM_STAFF
- **Purpose:** Testing admin functionality

### 2. Customer (Demo User - matches frontend defaults)
- **Email:** `admin-01@ecme.com`
- **Phone:** `+218911234568`
- **Role:** CUSTOMER
- **Purpose:** Primary test user for customer features (matches demo frontend)

### 3. Vendor
- **Email:** `vendor@ecme.com`
- **Phone:** `+218911234569`
- **Role:** VENDOR
- **Purpose:** Testing vendor/seller functionality

### 4. Delivery Person
- **Email:** `delivery@ecme.com`
- **Phone:** `+218911234570`
- **Role:** DELIVERY_PERSON
- **Purpose:** Testing delivery functionality

### 5. Multi-Role User
- **Email:** `multi@ecme.com`
- **Phone:** `+218911234571`
- **Roles:** CUSTOMER + VENDOR
- **Purpose:** Testing users with multiple roles

## How to Run Seeding

### Option 1: Using npm script
```bash
cd backend
npm run seed
```

### Option 2: Using Prisma
```bash
cd backend
npx prisma db seed
```

### Option 3: Reset and seed
```bash
cd backend
npx prisma migrate reset --force
# This will automatically run the seed script after migration
```

## Login Testing

### Using Email
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin-01@ecme.com", "password": "123Qwe"}'
```

### Using Phone Number
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+218911234568", "password": "123Qwe"}'
```

### Frontend Integration
The seeded user `admin-01@ecme.com` matches the default values in the frontend demo application. You can now:

1. Start the backend server: `npm run start:dev`
2. Open the frontend application
3. Use any of the seeded credentials to test login functionality

## API Endpoints

- **Login:** `POST /auth/login`
- **Validate Credentials:** `POST /auth/validate-credential`
- **Register:** `POST /auth/register`
- **Profile:** `GET /auth/profile` (requires JWT token)

## Notes

- Users are created with `upsert` operations, so running the seed script multiple times is safe
- All passwords are properly hashed using bcrypt
- The seeding includes proper role assignments using the junction table
- Phone numbers use Libyan format (+218...)