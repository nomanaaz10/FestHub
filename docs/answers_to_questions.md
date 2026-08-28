# Answers to Your Questions

Here are the direct answers to the great questions you asked about deploying, CI/CD, data, and security:

### 1. If I make changes to the codebase, will it trigger CI/CD automatically? How does it work?
**No, not currently.** Simply making changes in VS Code and running `git push` to GitHub will **not** automatically update your live Firebase website right now. 

Currently, you are doing manual deployments. To update the live site, you must type:
1. `npm run build`
2. `npx firebase-tools deploy`

**How CI/CD works (if you want to add it later):**
Continuous Integration / Continuous Deployment (CI/CD) means GitHub talks directly to Firebase. If you want this in the future, you would run a command called `npx firebase init hosting:github`. This creates a special YAML file in your GitHub repo. From then on, every time you click "Merge" or type `git push origin main`, GitHub's computers will automatically run the build step and send it to Firebase for you, while you sit back and relax!

### 2. Will I be charged anything if I deploy a handful of times?
**Absolutely zero.** You are on the Firebase "Spark" plan, which is 100% free. 
*   **Deployments are free:** You can deploy 10 times a day or 100 times a day. It costs nothing.
*   **Hosting limits:** You get 10 GB of storage and 360 MB of bandwidth transferred per day for free.
*   **Database limits:** You are allowed 50,000 document reads, 20,000 document writes, and 20,000 document deletes **every single day**. 
Unless your college fest gets tens of thousands of users spamming the site every hour, you will never pay a dime.

### 3. Where is the dashboard for Sub-Admins? Or do they just edit directly on the website?
**They edit directly on the website.** 
Unlike the Super Admin who has a dedicated `/super-admin` control center, we designed the Sub-Admin experience to be seamless and "inline". 
When a Sub-Admin goes to the "Festivals" page or "Competitions" page, they will magically see "Create New", "Edit", and "Delete" buttons that normal students cannot see. They manage the content directly where it lives!

### 4. Have we added predefined fests in the database, or are they coming from code?
Before you clicked the "Seed Data" button, the Firestore Database was 100% empty. 

All of that beautiful baseline data (the "TechNova", "Cultural Fest", and the high-quality images) was written in the code inside a file called `src/firebase/seeder.js`. When you clicked the **"Seed / Reset Demo Data"** button in the Super Admin panel, the website took all that code and physically injected it into the live database. 

### 5. Did we do this just to make it appear appealing and real?
**Yes exactly!** We call this "dummy data" or "seed data". It is incredibly helpful when you are showing the website to a professor, your cousin, or an investor. Instead of showing them an empty, sad-looking website, the Seeder instantly makes it look like a thriving, busy portal. Once you are ready for real users, you can just delete the dummy data and add real events.

### 6. Have we made sure we hide the env keys or sensitive info from the codebase?
**Yes.** We created a file called `.gitignore`. This file explicitly tells Git to ignore the `.env` file where your keys live, meaning your `.env` file was **never uploaded to GitHub**.

*A quick note on Firebase Keys:* Even if someone did see your React Firebase config (like your API key), Firebase is uniquely designed so that those front-end keys are actually *supposed* to be public! They just tell the browser where your database is. Your actual security comes from the `firestore.rules` file we wrote. Because of those rules, a hacker cannot delete or edit your data even if they have your API key, unless their email is `nomanaaz10@gmail.com`.
