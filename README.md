# Auth-Based Todo App

A production-ready **Todo application** built with **Next.js**, **PostgreSQL**, and **session-based authentication**, using **Prisma ORM** for safe, explicit, and maintainable database access.

This project focuses on **backend correctness, schema discipline, OAuth integration, and real-world authentication patterns** — not tutorial shortcuts or framework magic.

---

## 📸 Preview

### Welcome

![Welcome Page](screenshots/welcome_page.png)

### SignUp

![SignUp Page](screenshots/signup_page.png)

### Login

![Login Page](screenshots/login_page.png)

### Dashboard

![Todo Dashboard](screenshots/dashboard_page.png)

### Admin

![Todo Admin](screenshots/admin_page.png)

---

## 🚀 Features

- Email + password authentication
- OAuth authentication (**Google & GitHub**)
- **Account linking** across password and OAuth logins
- **Session-based authentication** (server-side, no JWT)
- Secure cookies (`httpOnly`, `secure`, `sameSite=lax`)
- Dynamic OAuth base URL (works across environments)
- Role-ready user model (`user`, `admin`)
- Create, complete, and soft-delete todos
- PostgreSQL with **proper constraints & indexes**
- **Atomic DB operations** (transactions & selective raw SQL)
- Prisma ORM with explicit Postgres adapter (Prisma v7)
- Production-ready setup for **Vercel + Neon**

---

## 🛠 Tech Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js Server Actions & Route Handlers
- **Prisma ORM (v7)**
- PostgreSQL
- `@prisma/adapter-pg`
- `bcryptjs` (password hashing)
- `zod` (input validation)

### Infrastructure

- Neon (PostgreSQL)
- Vercel (deployment)

---

## 🗄 Database Schema

Managed via **Prisma schema + migrations**, mapped explicitly to PostgreSQL.

### user

- `id` (serial, primary key)
- `email` (unique, nullable for OAuth-only users)
- `password_hash` (nullable)
- `name`
- `role` (`user` | `admin`)
- `avatar_url`
- `created_at`, `updated_at`

### oauth_account

- `id`
- `provider` (`google`, `github`)
- `provider_user_id`
- `user_id` (FK → user)
- `access_token`
- `refresh_token`
- `expires_at`
- `scope`

### session

- `id` (session token)
- `user_id` (FK → user)
- `expires_at`
- `created_at`

### todo

- `id`
- `title`
- `is_completed`
- `deleted_at` (soft delete)
- `user_id` (FK → user)
- `created_at`

Indexes are added on frequently queried columns (`email`, `user_id`, `deleted_at`, session expiration).

---

## 🔐 Authentication & Identity Model

### Core Principles

- Users are **people**, not login methods
- Authentication methods are **linked**, not duplicated
- Sessions are **server-side and stateful**
- OAuth identities are treated as **first-class citizens**

### Supported Auth Methods

- Email + password
- Google OAuth
- GitHub OAuth

A user may:

- have a password
- have one or more OAuth accounts
- transition between auth methods without duplication

---

## 🔗 Account Linking Behavior

- If an OAuth login returns an email that already exists:
  - the OAuth account is linked to the existing user

- OAuth-only users can later add a password
- Password users can later add OAuth providers
- No duplicate users per identity

OAuth provider identity (`provider + provider_user_id`) is the **primary identifier**.
Email is used as a **secondary unifier when available**.

---

## 🔐 Session-Based Authentication

- Passwords are hashed using **bcrypt**
- Login creates a **session record** in PostgreSQL
- Session ID is stored in an **HTTP-only cookie**
- All protected routes validate sessions **server-side**
- Logout deletes both the cookie and the DB session

This mirrors **real production auth systems** and avoids common JWT pitfalls.

---

## 🌐 OAuth Implementation Details

- OAuth initiation via **Server Actions**
- OAuth completion via **Route Handlers**
- CSRF protection using `state`
- PKCE is consistently applied across all OAuth providers
- OAuth base URL derived dynamically from request headers
- Static OAuth callbacks registered only for production domain

---

## 🧠 Database Access Strategy

- Prisma is used for **most queries**
- **Raw SQL is used selectively** for:
  - atomic updates
  - performance-critical operations
  - cases Prisma cannot express safely

This hybrid approach prioritizes **correctness over convenience**.

---

## 🚀 Deployment

- Hosted on **Vercel**
- PostgreSQL via **Neon**
- Environment variables managed in Vercel dashboard
- OAuth providers configured with stable production callbacks

---

## 📌 Why This Project

This project was built to:

- Practice **real authentication & OAuth patterns**
- Understand **session-based auth** deeply
- Learn **Prisma migrations on an evolving schema**
- Design identity systems that scale
- Avoid auth shortcuts and framework magic
- Build something that reflects **industry-grade backend fundamentals**

---

## 👤 Author

Built by **Vasu Singhal**

---

> If you’re reviewing this repository:
> focus on the **auth flows, OAuth linking logic, Prisma schema, and server-side session handling** — that’s where the real engineering work lives.
