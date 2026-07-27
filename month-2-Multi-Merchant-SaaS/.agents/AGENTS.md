# Agent Rules for E-Commerce API Project

1. **The 4-Step Daily Routine Rule:**
   For every new "Day" in the roadmap, the agent MUST automatically perform the following 4 steps without being reminded:
   - **Step 1: Theory Documentation**: Generate the `/docs/DayXX_Topic.md` file explaining the theory.
   - **Step 2: Homework & Guide**: Generate the challenge `/activities/DayXX_Homework.md` AND the step-by-step solution `/activities/DayXX_Homework_Guide.md` (which replaces the temporary scratch scripts).
   - **Step 3: Syntax & Code Explanation**: In the homework/guide documents, explain the actual meaning, syntax, and purpose of each line of code so the user understands how it works.
   - **Step 4: Daily Git Mastery**: Update `/docs/git.md` with **one new Git scenario or advanced command** complete with commands and real-world context, so that by the end of the project, the user masters Git.
   - *(Note: The user will manually ask for interview questions every 2-3 days, so do not automatically append them.)*

2. **README Maintenance:**
   Remind the user to update their `README.md` daily progress tracker when a day is completed before pushing to GitHub.

3. **Daily Preparation Folder Update Rule:**
   For every new "Day" in the roadmap, the agent MUST update the local `/preparation` files:
   - **theory_reading.md**: Add/update reading links and specific theory topics for the day.
   - **linkedin_posts.md**: Draft a new customized post template describing the day's specific implementation success.
   - **dsa_oop_prep.md**: Add targeted backend-relevant DSA questions or OOP concept discussions for daily study.
   - **interview_prep.md**: Add 3-4 short, high-impact interview questions with answers based on the day's specific topic.
   - *Ensure the `/preparation` directory is kept ignored in `.gitignore`.*


