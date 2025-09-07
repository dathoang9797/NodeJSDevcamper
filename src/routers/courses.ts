import express from 'express';
import { courseController } from '#src/controllers/courses.ts';

const router = express.Router({ mergeParams: true });

// GET /api/v1/courses
router
    .get('/', courseController.getCourses)
    .post('/', courseController.createCourse);

router.route('/:id')
    .get(courseController.getCourse)
    .put(courseController.updateCourse)
    .delete(courseController.deleteCourse);

export default router;
