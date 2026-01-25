# Image Processing Service

A production-ready **Node.js + TypeScript backend** for user authentication and image processing. The project supports secure user accounts, image uploads via Cloudinary, image transformations, pagination, and background processing with a clean layered architecture.

---

## 🚀 Features

- 🔐 **JWT Authentication** (Register / Login / Profile)
- 🖼️ **Image Uploads** using Multer + Cloudinary
- 🎨 **Image Transformations** (resize, crop, rotate, format, filters)
- 📄 **Paginated Image Listing** per user
- 🧵 **Background Worker** (RabbitMQ-ready)
- 🧠 **Prisma ORM** with SQLite
- 🛡️ **Centralized Error Handling**
- ⚡ **Scalable Architecture** (Controller / Service / Model)

---

## 🏗️ Project Structure

```
src
├── cache
│   └── redis.ts
├── config
│   └── cloudinary.ts
├── images
│   ├── image.controller.ts
│   ├── image.model.ts
│   ├── image.route.ts
│   └── image.service.ts
├── users
│   ├── user.controller.ts
│   ├── user.model.ts
│   ├── user.route.ts
│   ├── user.service.ts
│   └── user.validation.ts
├── middlewares
│   └── auth.ts
├── utils
│   ├── errorHandler.ts
│   ├── hash.ts
│   ├── jwt.ts
│   ├── multer.ts
│   └── rabbitmq.ts
├── types
│   ├── customError.ts
│   └── express.d.ts
├── index.ts
└── worker.ts
```

---

## 🧩 Tech Stack

- **Node.js**
- **TypeScript**
- **Express**
- **Prisma ORM**
- **SQLite**
- **Cloudinary**
- **Multer**
- **JWT**
- **RabbitMQ**

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

---

## 📦 Installation

```bash
npm install
```

Generate Prisma client:

```bash
npx prisma generate
```

Apply database schema:

```bash
npx prisma migrate dev --name init
```

---

## ▶️ Running the Project

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Worker (Background Jobs)

```bash
ts-node worker.ts
```

---

## 🔑 Authentication Endpoints

| Method | Endpoint | Description |
|------|--------|------------|
| POST | `/users/register` | Register user |
| POST | `/users/login` | Login |
| GET | `/users/profile` | Get profile (JWT required) |

---

## 🖼️ Image Endpoints

| Method | Endpoint | Description |
|------|--------|------------|
| POST | `/images` | Upload image (JWT + multipart) |
| POST | `/images/transform` | Transform image |
| GET | `/images?page=1&limit=10` | Paginated images (JWT) |
| GET | `/images/:publicId` | Get image by ID |

---

## 🧠 Architecture Principles

- **Controllers**: HTTP layer only
- **Services**: Business logic
- **Models**: Database access (Prisma)
- **Utils**: Shared helpers
- **Middlewares**: Auth & validation


## ❌ Error Handling

All errors go through a centralized error handler:

```json
{
  "status": "error",
  "message": "Error description"
}
```
