# 🇨🇦 job-about
**AI-powered job matching for Korean immigrants & local businesses in Canada**  
🔗 **[Try our service →](https://job-about.vercel.app/)**

---

## ✨ What is job-about?
Job-about connects job seekers and employers in Canada through **fun work-style quizzes**, smart recommendations, and AI-assisted job postings.  
We make hiring and applying fast, simple, and surprisingly enjoyable.

---
<p>
  <img src="docs/assets/0_main_page_1.png" alt="Main Page 1" width="30%">
  <img src="docs/assets/s1_onboarding_1.png" alt="Onboarding 1" width="30%">
</p>

## 🙋🏻‍♀️ For Job Seekers

1. **Log in with Google and select “Create Job Seeker”** — quick, secure, and no password hassle.
   <p>
     <img src="docs/assets/s1_onboarding_2.png" alt="Onboarding 2" width="30%">
   </p>


2. **Take our story-based work-style quiz** — an interactive and engaging test that reveals your preferred way of working based on everyday situations.
   <p>
     <img src="docs/assets/s2_quiz_1.png" alt="Quiz 1" width="30%">
     <img src="docs/assets/s2_quiz_2.png" alt="Quiz 2" width="30%">
   </p>


3. **Create your profile** — highlight your skills and preferred job types.
   <p>
     <img src="docs/assets/s3_profile_1.png" alt="Profile 1" width="30%">
     <img src="docs/assets/s3_profile_2.png" alt="Profile 2" width="30%">
   </p>


4. **Browse your personalized job feed** — discover roles that match your profile. You can also use filters to further personalize your search.
   <p>
     <img src="docs/assets/s4_feed_1.png" alt="Job Post 1" width="30%">
     <img src="docs/assets/s4_feed_2.png" alt="Job Post 2" width="30%">
   </p>


5. **Apply in one click** — open the job post, view details, and apply instantly. You can also bookmark jobs for later — no tedious forms.
   <p>
     <img src="docs/assets/s5_job_post_1.png" alt="Job Post 1" width="30%">
     <img src="docs/assets/s5_job_post_2.png" alt="Job Post 2" width="30%">
     <img src="docs/assets/s5_job_post_3.png" alt="Job Post 3" width="30%">
   </p>


6. **Track your journey** — monitor all your applications and statuses in one dashboard.
   <p>
     <img src="docs/assets/s6_mypage_1.png" alt="My Page 1" width="24%">
     <img src="docs/assets/s6_mypage_2.png" alt="My Page 2" width="24%">
     <img src="docs/assets/s6_mypage_3.png" alt="My Page 3" width="24%">
     <img src="docs/assets/s6_mypage_4.png" alt="My Page 4" width="24%">
   </p>

---

## 🏢 For Employers
1. **Log in with Google** — instant access to your hiring dashboard.
   <p>
     <img src="docs/assets/e0_onboarding.png" alt="Onboarding 1" width="30%">
   </p>


2. **Create a business profile** — showcase your company’s personality and values.
   <p>
     <img src="docs/assets/e1_bizLoc_1.png" alt="Employer profile 1" width="30%">
     <img src="docs/assets/e1_bizLoc_2.png" alt="Employer profile 2" width="30%">
   </p>
   

3. **Post jobs with AI** — our AI helps you write engaging, clear job postings in seconds.
   <p>
     <img src="docs/assets/e2_jobPost_1.png" alt="Job Post 1" width="30%">
     <img src="docs/assets/e2_jobPost_2.png" alt="Job Post 2" width="30%">
   <br><br>
   </p>
   🪄 Use Gemini API to generate job descriptions.
   <p>
     <img src="docs/assets/e3_preview_1.png" alt="Job Post Preview 1" width="30%">
     <img src="docs/assets/e3_preview_2.png" alt="Job Post Preview 2" width="30%">
   <br><br></p>
   

4. **Manage everything in one place** — from job listings to candidate pipelines.
   <br>**Manage you job listings** — view, edit, and close your job posts.
   <p>
     <img src="docs/assets/e4_dashboard_1.png" alt="Job Post Preview 1" width="24%">
     <img src="docs/assets/e4_dashboard_5.png" alt="Employer dashboard-Job Post 1" width="24%">
     <img src="docs/assets/e4_dashboard_6.png" alt="Employer dashboard-Job Post 2" width="24%">
     <img src="docs/assets/e4_dashboard_7.png" alt="Employer dashboard-Job Post 1" width="24%">
   <br><br>
   </p>

   **Review applications** — see who applied, their profiles, and track their status.
   <p>
     <img src="docs/assets/e4_dashboard_2.png" alt="Employer dashboard-Review Apps 1" width="30%">
     <img src="docs/assets/e4_dashboard_3.png" alt="Employer dashboard-Review Apps 2" width="30%">
     <img src="docs/assets/e4_dashboard_4.png" alt="Employer dashboard-Review Apps 3" width="30%">
   </p>


---

## 🚀 Why job-about?
- **Fast & Easy** — no endless forms or complicated tools.
- **Smart Matching** — candidates meet jobs that *truly* fit them.
- **Bilingual-Friendly** — bridging Korean and English-speaking communities.
- **AI-Powered** — better job descriptions, smarter recommendations.

---
## 📚 Behind Our Project

### 🛠 Tech Stack
- **Frontend:** Next.js, React, TypeScript
- **Backend:** Next.js API Routes, Prisma ORM, PostgreSQL (Supabase)
- **Infrastructure:** Vercel, Sentry (logging & monitoring)
- **AI Services:** Gemini API for AI-assisted job posting

### 🗂 System Design (Overview)!
   <p>
     <img src="docs/assets/jobAbout_system_design.png" alt="System Design" width="90%">
   </p>

Job-about follows a **modern full-stack architecture**:
- **Client Layer** — Interactive UI built with Next.js and React.
- **API Layer** — Serverless API routes for job matching, authentication, and data access.
- **Database Layer** — PostgreSQL hosted on Supabase, accessed via Prisma ORM.
- **Integration Layer** — AI services (Gemini API) for generating job descriptions.
