# Auth-Based Todo App

A production-ready **Todo application** built with **Next.js**, **PostgreSQL**, and **session-based authentication**.

This project focuses on **backend correctness and real-world auth patterns** rather than tutorial shortcuts.

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

- User authentication (signup / login / logout)
- **Session-based auth** (server-side, no JWT)
- Secure cookies (`httpOnly`, `secure`, `sameSite=lax`)
- Role-ready user model (`user`, `admin`)
- Create, complete, and soft-delete todos
- PostgreSQL with proper constraints & indexes
- Transaction-safe DB operations
- Production-ready setup for Vercel + Neon

---

## 🛠 Tech Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js Route Handlers / Server Actions
- PostgreSQL
- `pg` (node-postgres)
- `bcryptjs` (password hashing)
- `zod` (input validation)

### Infrastructure

- Neon (cloud PostgreSQL)
- Vercel (deployment)

---

## 🗄 Database Schema

### Users

- `id` (serial, primary key)
- `email` (unique)
- `password_hash`
- `name`
- `role` (`user` | `admin`)
- `created_at`, `updated_at`

### Sessions

- `id` (session token)
- `user_id` (FK → users)
- `expires_at`
- `created_at`

### Todos

- `id`
- `title`
- `is_completed`
- `deleted_at` (soft delete)
- `user_id` (FK → users)
- `created_at`

Indexes are added on frequently queried columns (`email`, `user_id`, active todos, sessions).

---

## 🔐 Authentication Model

- Passwords are hashed using **bcrypt**
- Login creates a **session record** in PostgreSQL
- Session ID is stored in an **HTTP-only cookie**
- All protected routes validate the session **server-side**
- Logout deletes both the cookie and the DB session

This avoids common JWT pitfalls and mirrors how real production apps handle auth.

---

## 📌 Why This Project

This project was built to:

- Practice **real authentication patterns**
- Avoid tutorial-only abstractions
- Understand PostgreSQL constraints, indexes, and sessions
- Build something that reflects **industry-grade fundamentals**

---

## 📄 License

This project is for learning and portfolio purposes.

---

## 👤 Author

Built by **Vasu Singhal**

---

If you’re reviewing this repo: focus on the **auth flow, DB design, and server-side logic** — that’s where the real work is.
