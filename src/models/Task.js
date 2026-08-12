import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Please provide a task text"],
      trim: true,
      maxLength: [100, "Task cannot be more than 100 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      default: "Today",
    },
    time: {
      type: String,
      default: "",
    },
  },
  { 
    timestamps: true,
  }
);

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);