import express from 'express';
import { bootcampController } from '#src/controllers/bootcamps.ts';
import course from '#src/routers/courses.ts';
import { advancedResults } from '#src/middleware/advancedResult.ts';
import bootcamp from '#src/models/bootcamp.ts';
import { protect } from '#src/middleware/auth.ts';

const {
    getBootcamps, getBootcamp, createBootcamp, updateBootcamp,
    deleteBootcamp, uploadImage
} = bootcampController;

const router = express.Router();

//Re-route into other resource router
router.use("/:bootcampId/courses", course);

router.route("/")
    .get(advancedResults(bootcamp, 'courses'), getBootcamps)
    .post(protect, createBootcamp);

router.route("/:id")
    .get(getBootcamp)
    .put(protect, updateBootcamp)
    .delete(protect, deleteBootcamp);

router.route("/:id/photo")
    .put(uploadImage);

// router.route("/radius/:zipcode/:distance")
//     .get(bootcampController.getBootcampsInRadius);

export default router;