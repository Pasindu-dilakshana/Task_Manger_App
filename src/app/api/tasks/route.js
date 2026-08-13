import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { getUserIdFromRequest } from "@/lib/auth";

// 1. READ TASKS (only the logged-in user's tasks)
export async function GET(request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 }); // Sorts by newest first
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// 2. CREATE A TASK
export async function POST(request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const { text, date, time } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Task text is required" }, { status: 400 });
    }

    const newTask = await Task.create({ text, date, time, userId });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)[0]?.message || "Invalid task";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

// 3. UPDATE A TASK (Checkmarks & Edits)
export async function PUT(request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const { id, text, completed } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Task id is required" }, { status: 400 });
    }

    const update = {};
    if (text !== undefined) update.text = text;
    if (completed !== undefined) update.completed = completed;

    // Scope by userId too, so a user can't update someone else's task by guessing an id
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId },
      update,
      { new: true, runValidators: true } // Returns the updated document
    );

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Failed to update task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// 4. DELETE A TASK
export async function DELETE(request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    // Grab the ID from the URL (e.g., /api/tasks?id=123)
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Task id is required" }, { status: 400 });
    }

    // Scope by userId too, so a user can't delete someone else's task by guessing an id
    const deletedTask = await Task.findOneAndDelete({ _id: id, userId });

    if (!deletedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
