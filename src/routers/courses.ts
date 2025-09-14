import express from 'express';
import { courseController } from '#src/controllers/courses.ts';
import { advancedResults } from '#src/middleware/advancedResult.ts';
import course from '#src/models/course.ts';
import { authorized, protect } from '#src/middleware/auth.ts';

const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = courseController;
const router = express.Router({ mergeParams: true });

// GET /api/v1/courses
router.route('/')
    .get(advancedResults(course, {
        path: "bootcamp",
        select: "name description"
    }), getCourses)
    .post(protect, authorized("publisher", "admin"), addCourse);

router.route('/:id')
    .get(getCourse)
    .put(protect, authorized("publisher", "admin"), updateCourse)
    .delete(protect, authorized("publisher", "admin"), deleteCourse);

export default router;
