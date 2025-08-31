import express from 'express';
import { bootcampController } from '#src/controllers/bootcamps.ts';
const router = express.Router();

router.route("/")
    .get(bootcampController.getBootcamps)
    .post(bootcampController.createBootcamp);

router.route("/:id")
    .get(bootcampController.getBootcamp)
    .put(bootcampController.updateBootcamp)
    .delete(bootcampController.deleteBootcamp);

export default router;