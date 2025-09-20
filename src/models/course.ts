import mongoose, { Model, Types } from "mongoose";

interface ICourse extends Document {
    title: string;
    tuition: number;
    description: string;
    weeks: string;
    minimumSkill: string;
    scholarshipAvailable: boolean;
    createdAt: Date;
    bootcamp: Types.ObjectId;
    user: Types.ObjectId;
}
interface ICourseModel extends Model<ICourse> {
    getAverageCost: Function
}

const CourseSchema = new mongoose.Schema<ICourse, ICourseModel>({
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
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please add a user"]
    },
});

CourseSchema.statics.getAverageCost = async function (bootcampId: string) {
    const obj = await this.aggregate([
        { $match: { bootcamp: bootcampId } },
        { $group: { _id: "$bootcamp", averageCost: { $avg: "$tuition" } } }
    ]);

    try {
        await mongoose.model("Bootcamp").findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        });
    }
    catch (err) {
        console.error(err);
    }
};

//call getAverageCost after save 
CourseSchema.post("save", async function () {
    await (this.constructor as ICourseModel).getAverageCost(this.bootcamp);
});

//call getAverageCost before remove
CourseSchema.pre("findOneAndDelete", async function () {
    const bootcampId = this.getFilter().bootcamp;
    if (bootcampId) {
        await (this.constructor as ICourseModel).getAverageCost(bootcampId);
    }
});



export default mongoose.model<ICourse, ICourseModel>("Course", CourseSchema);