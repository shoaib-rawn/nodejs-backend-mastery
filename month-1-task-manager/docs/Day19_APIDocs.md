# Day 19: API Documentation (Swagger)

> [!NOTE]
> 🗺️ **Roadmap.sh Progress:** Building an API is only half the battle. If nobody knows how to use your API, it is useless! Today, we learn how to automatically document our API so frontend developers can consume it.

## 1. Why do we need API Documentation?
Imagine you are a Frontend Developer building a React app. You need to get a list of tasks.
* What is the exact URL?
* Do you use GET or POST?
* What does the JSON response look like?
* What query parameters (like `page` or `sortBy`) are allowed?

Without documentation, the frontend developer would have to manually read through hundreds of lines of your backend code just to figure out how to make a simple request. API Documentation acts as an instruction manual for your API.

## 2. What is Swagger?
**Swagger (OpenAPI)** is the industry standard for writing API documentation. Instead of writing a boring text file or a wiki, Swagger generates a beautiful, interactive web interface.

With Swagger, developers can actually test your API directly from the documentation webpage without even opening Postman!

## 3. How does it work in Express?
We use two packages:
1. `swagger-jsdoc`: This reads special comments we write above our routes and converts them into the official OpenAPI JSON format.
2. `swagger-ui-express`: This takes that JSON format and builds the beautiful webpage UI for us!
