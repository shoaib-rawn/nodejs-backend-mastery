# Day 17: API Rate Limiting

> [!NOTE]
> 🗺️ **Roadmap.sh Progress:** Security is a fundamental part of Backend Engineering. Today, we protect our server from being overwhelmed by spam.

## 1. What is a DDOS Attack?
A Distributed Denial of Service (DDOS) attack is when a malicious hacker commands thousands of computers to send requests to your server at the exact same time. 
Because your server has limited memory and processing power, it will crash. Legitimate users won't be able to access your API because the hacker is consuming all the resources.

## 2. What is Rate Limiting?
Rate Limiting is a security technique that restricts the number of requests a single IP address can make to your server within a specific timeframe. 

For example, you can say: *"A single user can only make 100 requests every 15 minutes. If they make 101 requests, block them and return a 429 Too Many Requests error."*

## 3. How to implement Rate Limiting in Express
Express doesn't have a built-in rate limiter. The industry standard is to use the `express-rate-limit` middleware. 

It is incredibly easy to configure:
1. You define a "window" of time (e.g., 15 minutes).
2. You define the "max" number of requests allowed in that window.
3. You provide a custom error message for when the limit is exceeded.
4. You mount the middleware globally to `app.use()` so it protects every single route!
