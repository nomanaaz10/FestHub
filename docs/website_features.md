# FestHub: Complete Feature List

Welcome to the comprehensive feature breakdown of the **College Fest & Competition Portal (FestHub)**.

## 1. Role-Based Access Control (RBAC)
The platform supports three distinct user levels:
*   **Super Admin** (Master account: `nomanaaz10@gmail.com`)
*   **Sub-Admins** (Event organizers appointed by the Super Admin)
*   **Students/Users** (General participants)

## 2. Super Admin Control Center (`/super-admin`)
A dedicated, highly secure dashboard exclusively for the master account.
*   **Database Seeder ("Seed / Reset Demo Data"):** A one-click button that populates the database with high-quality, realistic dummy data (fests, competitions, webinars, announcements) featuring Unsplash images.
*   **Metrics Dashboard:** Live counters for total users, active sub-admins, festivals, competitions, and announcements.
*   **Sub-Admin Whitelist:** Search for any registered student by email and instantly upgrade them to a "Sub-Admin" so they can manage content. Includes the ability to revoke this access.
*   **Master Content Moderation:** Ability to view and permanently delete any festival, competition, announcement, or webinar on the platform to enforce community guidelines.

## 3. Sub-Admin (Organizer) Features
Instead of a separate dashboard, Sub-Admins get powerful "inline" editing capabilities across the platform.
*   **Create Content:** Special buttons appear on the Festivals, Competitions, Announcements, and Webinars pages allowing them to add new events.
*   **Manage Content:** Edit or Delete buttons appear on events, allowing organizers to update rules, change dates, or remove canceled events.

## 4. Student & Participant Features
*   **Secure Authentication:** Sign up and log in via Email/Password or 1-Click Google Sign-In.
*   **Event Registration:** One-click enrollment into competitions.
*   **User Profile (`/profile`):** A personalized dashboard showing the user's details, verified status, and a list of all enrolled competitions. Users can also withdraw their registration from here.
*   **Social Interactions:** 
    *   **Like System:** Users can "like" festivals and competitions (featuring optimistic UI for instant feedback).
    *   **Comment Section:** Users can leave comments and questions on event pages. Authors can delete their own comments. Sub-Admins/Super Admins get a special "Verified" badge next to their comments.

## 5. Core Platform Modules
*   **Festivals:** Browse upcoming college fests with rich banners, dates, and venue information.
*   **Competitions:** Filterable list of competitions tied to specific fests. Includes details like prize pools, team sizes, and deadlines.
*   **Announcements:** A noticeboard for urgent updates, schedule changes, or winner declarations. High-priority notices are highlighted.
*   **Webinars:** Virtual events and workshops with speaker details and meeting links.

## 6. Advanced UI/UX Features
*   **Image Carousel & Lightbox:** Click on any event image to open a full-screen, swipeable gallery.
*   **Toast Notifications:** Non-intrusive popup alerts in the corner of the screen confirming successful actions (e.g., "Successfully Registered!").
*   **Glassmorphism Design:** Modern, sleek, translucent UI components built with Tailwind CSS.
*   **Responsive Mobile Drawer:** A mobile-friendly hamburger menu for seamless navigation on phones.
