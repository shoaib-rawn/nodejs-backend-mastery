# Day 16: Handling File Uploads (Multer)

> [!NOTE]
> 🗺️ **Roadmap.sh Progress:** We are now starting Week 4! Today we learn how to handle files (like images, PDFs, or CSVs) sent from the frontend to our Express backend.

## 1. The Problem with Files
Up until now, we have been sending JSON data (`express.json()`). JSON is just plain text. 
However, an image or a video is a **binary file**. You cannot send a picture inside a JSON object. 

To send files over HTTP, the frontend must change its request type from `application/json` to `multipart/form-data`.

## 2. What is `multipart/form-data`?
Imagine sending a physical package in the mail. If you want to send a letter (text) and a camera (binary file) in the same box, you wrap them separately inside the box. 
`multipart/form-data` literally splits the HTTP request into multiple "parts". One part might be the `title` string, and the other part is the `image` file.

## 3. Introducing Multer
Express *cannot* read `multipart/form-data` by default. If a user uploads an image, Express will just see gibberish or nothing at all. 

To fix this, we use a famous third-party middleware called **Multer**. Multer's entire job is to look at the incoming HTTP request, find the file chunks, reassemble them into a complete file, and save it to a folder on your server's hard drive!

### How Multer Works:
1. You tell Multer which folder to save files into (e.g., `uploads/`).
2. You place Multer as a middleware on a specific route.
3. When a request hits that route, Multer saves the image to the folder.
4. Multer then attaches information about the file (like the filename and path) to a special object: `req.file`.
5. Your controller can then take `req.file.filename` and save that string to your JSON database!
