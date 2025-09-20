import mongoose, { Model, Types } from "mongoose";

interface IReview extends Document {
    title: string;
    text: string;
    rating: number;
    createdAt: Date;
    bootcamp: Types.ObjectId;
    user: Types.ObjectId;
}
interface IReviewModel extends Model<IReview> {
    // Add any static methods here if needed in the future
    getAverageCost: Function
}

const ReviewSchema = new mongoose.Schema<IReview, IReviewModel>({
    title: {
        type: String,
        trim: true,
        required: [true, "Please add a Review title"],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, "Please add some text"],
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, "Please add a rating"],
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
},
    {
        methods: {},
        statics: {
            async getAverageCost(bootcampId: string) {
                const obj = await this.aggregate([
                    { $match: { bootcamp: bootcampId } },
                    { $group: { _id: "$bootcamp", averageRating: { $avg: "$rating" } } }
                ]);

                try {
                    await mongoose.model("Bootcamp").findByIdAndUpdate(bootcampId, {
                        averageRating: obj[0].averageRating
                    });
                }
                catch (err) {
                    console.error(err);
                }
            }
        }
    });

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

//call getAverageCost after save
ReviewSchema.post("save", async function () {
    await (this.constructor as IReviewModel).getAverageCost(this.bootcamp);
});

//call getAverageCost before remove
ReviewSchema.pre("findOneAndDelete", async function () {
    const bootcampId = this.getFilter().bootcamp;
    if (bootcampId) {
        await (this.constructor as IReviewModel).getAverageCost(bootcampId);
    }
});

const ReviewModel = mongoose.model<IReview, IReviewModel>("Review", ReviewSchema);
export default ReviewModel;