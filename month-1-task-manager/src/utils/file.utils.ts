import fs from 'fs/promises';
import path from 'path';

// Define the absolute path to our mock database file
const dataFilePath = path.resolve('src/data/tasks.json');

// 1. Define what a "Task" looks like
export interface Task {
    id: string;
    title: string;
    completed: boolean;
    createdAt?: string;
    imageUrl?: string;
}

// --- File System Helper Functions ---

// Reads the JSON file and returns an array of Tasks
export const readTasks = async (): Promise<Task[]> => {
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is empty, return empty array
        return [];
    }
};

// Writes an array of Tasks back to the JSON file
export const writeTasks = async (tasks: Task[]): Promise<void> => {
    const jsonText = JSON.stringify(tasks, null, 2);
    await fs.writeFile(dataFilePath, jsonText, 'utf-8');
};
