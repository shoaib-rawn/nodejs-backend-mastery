# Agent Rules for Task Manager Project

1. **The 4-Step Daily Routine Rule:**
   For every new "Day" in the roadmap, the agent MUST automatically perform the following 4 steps without being reminded:
   - **Step 1:** Generate the `/docs/DayXX_Topic.md` file explaining the theory.
   - **Step 2:** Generate the `/activities/DayXX_Homework.md` file giving the user a challenge.
   - **Step 3:** Perform the **implementation** in the actual project code.
   - *(Note: The user will manually ask for interview questions every 2-3 days to keep them concise and important, so do not automatically append them anymore.)*

2. **README Maintenance:**
   Remind the user to update their `README.md` daily progress tracker when a day is completed before pushing to GitHub.
