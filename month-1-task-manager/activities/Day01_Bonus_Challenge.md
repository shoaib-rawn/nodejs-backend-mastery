# Day 1: Bonus Activity

If you have an extra 30 minutes, complete these two tasks to practice JSON structuring and HTTP Status Codes.

## Task 1: The Profile Route (JSON Practice)
Right now, our routes just return simple messages. Let's make one that returns complex data.

1. Open `server.js` and add a new `GET` route for `/api/profile`.
2. Make it return a detailed JSON object about yourself. It must include:
   * A string (`name`: "Arslan")
   * A number (`age`: 25)
   * A boolean (`isLearningBackend`: true)
   * An array of your hobbies (`hobbies`: ["coding", "gaming", ...])
3. Test it in your browser!

## Task 2: The Secret Route (Status Codes)
By default, Express always sends a "200 OK" success status code. Let's learn how to send an error!

1. Add a new `GET` route for `/api/secret`.
2. Instead of just doing `res.json()`, use `res.status(404)` to tell the browser the resource is "Not Found". 
   * *Hint: The code looks like this:* 
     ```javascript
     app.get('/api/secret', (req, res) => {
         res.status(404).json({ error: "Nice try, but you can't see this!" });
     });
     ```
3. Open your browser's "Network Tab" (Right-click -> Inspect -> Network) and visit `http://localhost:5000/api/secret`. You will actually see the browser register it as a red 404 error!
========================================================================