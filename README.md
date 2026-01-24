# Image Processing Service Backend

Backend for an image processing service (like Cloudinary) using **Node.js, TypeScript, Express, Prisma (SQLite)**.  

Currently, only **user authentication** is implemented.

---

## Project Structure

```

.
├── config/cloudinary.ts
├── index.ts
├── middlewares/auth.ts
├── types/customError.ts
├── types/express.d.ts
├── users/
│   ├── user.controller.ts
│   ├── user.model.ts
│   ├── user.route.ts
│   ├── user.service.ts
│   └── user.validation.ts
└── utils/
├── errorHandler.ts
├── hash.ts
└── jwt.ts

````

---

## Features Implemented

- User Registration & Login  
- JWT-based Authentication  
- Password hashing  
- Express middleware for protected routes

---

## Setup

1. Install dependencies:

```bash
npm install
````

2. Create `.env`:

```
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Setup Prisma:

```bash
mkdir -p prisma
touch prisma/dev.db
npx prisma db push
```

4. Run:

```bash
npx ts-node src/index.ts
# or compile first
npx tsc
node dist/index.js
```

---

## API Endpoints

### Auth

* **Register:** `POST /register`
  Body: `{ "username": "user1", "password": "password123" }`
  Response: user object + JWT

* **Login:** `POST /login`
  Body: `{ "username": "user1", "password": "password123" }`
  Response: user object + JWT

> Protected routes require `Authorization: Bearer <JWT>` header.


## Next Steps

* Image upload & retrieval
* Image transformations (resize, crop, rotate, filters, format conversion)
* Cloud storage integration (S3, Cloudflare R2, GCP)
* Async processing & caching

