import express from 'express';
import { advancedResults } from '#src/middleware/advancedResult.ts';
import Review from '#src/models/reviews.ts';
import { getReviews, getReview, addReview, updateReview, deleteReview } from '#src/controllers/reviews.ts';
import { authorized, protect } from '#src/middleware/auth.ts';

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(advancedResults(Review, {
        path: "bootcamp",
        select: "name description"
    }), getReviews)
    .post(protect, authorized("user", "admin"), addReview);

router.route('/:id')
    .get(getReview)
    .put(protect, authorized("user", "admin"), updateReview)
    .delete(protect, authorized("user", "admin"), deleteReview);

export default router;