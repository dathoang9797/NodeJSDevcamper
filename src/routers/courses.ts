import express from 'express';
import { courseController } from '#src/controllers/courses.ts';
import { advancedResults } from '#src/middleware/advancedResult.ts';
import course from '#src/models/course.ts';

const router = express.Router({ mergeParams: true });

// GET /api/v1/courses
router.route('/')
    .get(advancedResults(course, {
        path: "bootcamp",
        select: "name description"
    }), courseController.getCourses)
    .post(courseController.createCourse);

router.route('/:id')
    .get(courseController.getCourse)
    .put(courseController.updateCourse)
    .delete(courseController.deleteCourse);

export default router;
