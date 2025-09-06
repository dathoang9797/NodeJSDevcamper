import mongoose from "mongoose";
import bootcamp from "./bootcamp.ts";

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a course title"],
        trim: true,
        maxlength: [100, "Title can not be more than 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Please add a course description"],
        maxlength: [500, "Description can not be more than 500 characters"]
    },
    weeks: {
        type: String,
        required: [true, "Please add a number of weeks"],
        maxlength: [100, "Weeks can not be more than 100 characters"]
    },
    tuition: {
        type: Number,
        required: [true, "Please add a tuition cost"]
    },
    minimumSkill: {
        type: String,
        required: [true, "Please add a minimum skill level"],
        enum: ["beginner", "intermediate", "advanced"]
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bootcamp",
        required: [true, "Please add a bootcamp"]
    }
});

export default mongoose.model("Course", CourseSchema);