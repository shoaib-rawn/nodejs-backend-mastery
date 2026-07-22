# Day 2: Homework & Activities

Today's goal is to download our most important testing tool and learn how to explicitly send status codes.

## Task 1: Setup Postman
1. Go to [https://www.postman.com/downloads/](https://www.postman.com/downloads/) and download the desktop app.
2. Open it, create an account if asked, and open a "New Request".
3. Change the method dropdown to `GET`.
4. Enter `http://localhost:5000/api/health` as the URL and click **Send**. 
5. You should see your JSON response appear at the bottom!

## Task 2: Create a 400 Bad Request Route
Right now, you know how to send a `404 Not Found` (from yesterday's bonus challenge). Let's practice another very common status code.

1. Open `server.js`.
2. Create a new `GET` route for `/api/error`.
3. Inside the route, use `res.status(400)` to send a JSON error message.
   * *Code:* `res.status(400).json({ error: "Bad Request: Missing required data!" });`
4. Go into **Postman** and make a `GET` request to `http://localhost:5000/api/error`.
5. Look at the top right of the response window in Postman. You will see a red `400 Bad Request` status!
