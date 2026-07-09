# 🎬 ReelsPro: AI-Powered Video Streaming Platform

ReelsPro is a premium, full-stack Next.js application designed for uploading, managing, and streaming short-form video content (Reels/Shorts). Built with a focus on top-tier UI/UX, it features a glassmorphism design system, seamless video uploads via ImageKit, and robust authentication.

## ✨ Features

* **Premium UI/UX:** Built with Tailwind CSS and DaisyUI, featuring frosted-glass navbars (glassmorphism), dynamic loading animations, and highly responsive mobile layouts.
* **Authentication:** Secure user login and registration powered by NextAuth.js (Credentials Provider) and bcrypt password hashing.
* **Seamless Video Uploads:** Direct-to-cloud uploads using ImageKit, complete with drag-and-drop UI, real-time progress bars, and strict file validation (Max 100MB, MP4/WebM).
* **Dynamic Video Feed:** A TikTok/Reels-style grid feed that dynamically pulls database entries and streams high-quality video.
* **Dedicated Viewing Pages:** Server-rendered dynamic routes (`/videos/[id]`) for optimal SEO, fast loading, and distraction-free viewing.
* **Database Integration:** MongoDB with Mongoose ODM for secure and scalable metadata storage.

--

## 🛠️ Tech Stack

* **Framework:** [Next.js 15+](https://nextjs.org/) (App Router, Server Components)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database:** [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
* **Authentication:** [NextAuth.js](https://next-auth.js.org/)
* **Cloud Storage/CDN:** [ImageKit.io](https://imagekit.io/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
* **Icons:** [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```text
├── app/
│   ├── api/                  # Backend API Routes
│   │   ├── auth/             # NextAuth endpoints
│   │   ├── imagekit-auth/    # ImageKit upload signature generation
│   │   ├── register/         # User creation route
│   │   └── videos/           # CRUD operations for video metadata
│   ├── components/           # Reusable UI Components
│   │   ├── FileUpload.tsx    # ImageKit upload logic
│   │   ├── Header.tsx        # Navigation bar
│   │   ├── VideoFeed.tsx     # Video grid logic
│   │   ├── VideoUploadForm.tsx # Premium upload form UI
│   │   └── ...
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   ├── upload/               # Protected upload page
│   ├── utils/                # Database and API utilities
│   ├── videos/               # Frontend dynamic routes
│   │   └── [id]/page.tsx     # Single video details page
│   ├── layout.tsx            # Root layout & context providers
│   └── page.tsx              # Main homepage & feed
├── models/                   # Mongoose Database Schemas
│   ├── user.ts
│   └── video.ts
