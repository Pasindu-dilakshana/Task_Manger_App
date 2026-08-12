import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";

export async function GET() {
  try {
    await connectDB(); 
    
    const tasks = await Task.find().sort({ createdAt: -1 }); 
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { text, date, time, completed } = await request.json();
    
    await connectDB();
    
    const newTask = await Task.create({ text, date, time, completed });
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}