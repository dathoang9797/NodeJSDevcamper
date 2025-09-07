import express from 'express';
import { bootcampController } from '#src/controllers/bootcamps.ts';
import course from '#src/routers/courses.ts';

const router = express.Router();

//Re-route into other resource router
router.use("/:bootcampId/courses", course);

router.route("/")
    .get(bootcampController.getBootcamps)
    .post(bootcampController.createBootcamp);

router.route("/:id")
    .get(bootcampController.getBootcamp)
    .put(bootcampController.updateBootcamp)
    .delete(bootcampController.deleteBootcamp);

router.route("/:id/photo")
    .put(bootcampController.uploadImage);

// router.route("/radius/:zipcode/:distance")
//     .get(bootcampController.getBootcampsInRadius);

export default router;