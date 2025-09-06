import mongoose from 'mongoose';
import slugify from 'slugify';
import { GetLatLngByAddress } from '@geocoder-free/google';

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxLength: [100, 'Name cannot be more than 100 characters']
    },
    slug: String,
    description: {
        type: String,
        require: [true, 'Please add a description'],
        maxLength: [500, 'Description cannot be more than 500 characters']
    },
    website: {
        type: String,
        match: [
            /^https?:\/\/.+\..+/i,
            "Please enter a valid URL"
        ]
    },
    email: {
        type: String,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email"
        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address'],
    },
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number],
            index: "2dsphere"
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'Data Science',
            'AI & Machine Learning',
            'Cybersecurity',
            'Cloud Computing',
            'DevOps',
            'Game Development',
            'Blockchain',
            'Digital Marketing',
            "UI/UX", "Business"
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must be at most 10']
    },
    averageCost: {
        type: Number,
        min: [0, 'Cost must be at least 0']
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

//Create bootcamp slug from the name
BootcampSchema.pre('save', function (next) {
    console.log("Slugifying bootcamp name...");
    this.slug = slugify.default(this.name, { lower: true, strict: true });
    next();
});

BootcampSchema.pre('save', async function (next) {
    const location = await GetLatLngByAddress(this.address);
    console.log({ location })
    this.location = {
        type: 'Point',
        coordinates: [location[0], location[1]],
        formattedAddress: this.address,
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipcode: '12345',
        country: 'USA'
    };
    next();
});

// Cascade delete courses when a bootcamp is deleted
BootcampSchema.post('findOneAndDelete', async function (doc: any) {
    if (!doc) return;
    console.log(`Cascade deleting courses of bootcamp: ${doc._id}`);
    await doc.model('Course').deleteMany({ bootcamp: doc._id });
});

//Reverse populate with virtuals
BootcampSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false
});

export default mongoose.model('Bootcamp', BootcampSchema)
