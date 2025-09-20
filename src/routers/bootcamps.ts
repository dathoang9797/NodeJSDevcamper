import express from 'express';
import { bootcampController } from '#src/controllers/bootcamps.ts';
import course from '#src/routers/courses.ts';
import review from '#src/routers/reviews.ts';
import { advancedResults } from '#src/middleware/advancedResult.ts';
import bootcamp from '#src/models/bootcamp.ts';
import { protect, authorized } from '#src/middleware/auth.ts';

const {
    getBootcamps, getBootcamp, createBootcamp, updateBootcamp,
    deleteBootcamp, uploadImage
} = bootcampController;

const router = express.Router();

//Re-route into other resource router
router.use("/:bootcampId/courses", course);
router.use("/:bootcampId/reviews", review);

router.route("/")
    .get(advancedResults(bootcamp, 'courses'), getBootcamps)
    .post(protect, authorized("publisher", "admin"), createBootcamp);

router.route("/:id")
    .get(getBootcamp)
    .put(protect, authorized("publisher", "admin"), updateBootcamp)
    .delete(protect, authorized("publisher", "admin"), deleteBootcamp);

router.route("/:id/photo")
    .put(protect, authorized("publisher", "admin"), uploadImage);

// router.route("/radius/:zipcode/:distance")
//     .get(bootcampController.getBootcampsInRadius);

export default router;