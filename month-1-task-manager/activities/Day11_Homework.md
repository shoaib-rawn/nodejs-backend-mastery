# Day 11 Homework: Standardize JSON Responses

## The Challenge
Your API works perfectly, but the JSON responses are a bit messy. It's time to clean them up and make our API truly professional!

### Instructions:
Update every single controller in `src/controllers/task.controller.ts` to return data using a standardized **JSON Envelope**.

**The Standard Format:**
```typescript
{
    success: boolean;
    message?: string; // Optional (good for errors or creation success)
    data?: any;       // Optional (holds the actual tasks/task)
}
```

**Requirements:**
1. **`getAllTasks`**: Should return `{ success: true, data: filteredTasks }`
2. **`getTaskById`**: 
   - Success: `{ success: true, data: task }`
   - Not Found: `{ success: false, message: "Task not found" }`
3. **`createTask`**: Should return `{ success: true, data: newTask }`
4. **`updateTask`**:
   - Success: `{ success: true, data: task }`
   - Not Found: `{ success: false, message: "Task not found" }`
5. **`deleteTask`**:
   - Success: `{ success: true, message: "Task deleted successfully" }`
   - Not Found: `{ success: false, message: "Task not found" }`

Go through `task.controller.ts` and refactor the `res.json(...)` calls to match this pattern!
