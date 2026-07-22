import type { Request, Response, NextFunction } from 'express';

import fs from 'fs/promises';
import path from 'path';
import { type Task, readTasks, writeTasks } from '../utils/file.utils.js';

// 3. Controller to get all tasks (with Filtering and Pagination)
export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Extract query params with defaults
        const { completed } = req.query;
        const sortBy = (req.query.sortBy as string) || 'createdAt';
        const order = (req.query.order as string) || 'desc';

        let tasks = await readTasks();

        // 2. Filter by completed status
        if (completed === "true") tasks = tasks.filter(task => task.completed === true);
        if (completed === "false") tasks = tasks.filter(task => task.completed === false);

        // 3. Sort the filtered array
        tasks.sort((a, b) => {
            if (sortBy === 'createdAt') {
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                return order === 'desc' ? dateB - dateA : dateA - dateB;
            } else if (sortBy === 'title') {
                if (a.title < b.title) return order === 'desc' ? 1 : -1;
                if (a.title > b.title) return order === 'desc' ? -1 : 1;
                return 0;
            }
            return 0;
        });

        // 4. Extract pagination query params
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        // 3. Calculate start and end indexes
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // 4. Slice the filtered database array
        const paginatedTasks = tasks.slice(startIndex, endIndex);

        // 5. Return the data and helpful metadata
        res.status(200).json({
            success: true,
            message: "Tasks retrieved successfully",
            pagination: {
                currentPage: page,
                tasksPerPage: limit,
                totalTasks: tasks.length,
                totalPages: Math.ceil(tasks.length / limit)
            },
            data: paginatedTasks
        });
    } catch (error) {
        next(error);
    }
};

// 4. Controller to get a single task by ID
export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const tasks = await readTasks();
        const task = tasks.find(t => t.id === id);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

// 5. Controller to create a new task
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title } = req.body;
        const imageUrl = req.file ? '/uploads/' + req.file.filename : undefined;

        const tasks = await readTasks();
        const newTask: Task = {
            id: Date.now().toString(),
            title,
            completed: false,
            createdAt: new Date().toISOString()
        };

        if (req.file) {
            newTask.imageUrl = '/uploads/' + req.file.filename;
        }

        tasks.push(newTask);
        await writeTasks(tasks);

        res.status(201).json({ success: true, message: "Task created successfully", data: newTask });
    } catch (error) {
        next(error);
    }
};

// 6. Controller to update an existing task
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        
        const tasks = await readTasks();
        const task = tasks.find(t => t.id === id);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        task.title = title !== undefined ? title : task.title;
        task.completed = completed !== undefined ? completed : task.completed;
        
        // If the user uploaded a new image, update it and delete the old one
        if (req.file) {
            // Delete the old image from the hard drive to save space!
            if (task.imageUrl) {
                const oldImagePath = path.join(process.cwd(), task.imageUrl);
                try {
                    await fs.unlink(oldImagePath);
                } catch (err) {
                    console.log("Could not delete old image:", err);
                }
            }
            // Set the new image
            task.imageUrl = '/uploads/' + req.file.filename;
        }
        
        await writeTasks(tasks);

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

// 7. Controller to delete a task
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        
        const tasks = await readTasks();
        const taskIndex = tasks.findIndex(t => t.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const taskToDelete = tasks[taskIndex];
        
        // Delete the image from the hard drive if it exists
        if (taskToDelete.imageUrl) {
            const imagePath = path.join(process.cwd(), taskToDelete.imageUrl);
            try {
                await fs.unlink(imagePath);
            } catch (err) {
                console.log("Could not delete orphaned image:", err);
            }
        }

        tasks.splice(taskIndex, 1);
        await writeTasks(tasks);
        
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const throwError = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Something went wrong!");
    next(error);
};
