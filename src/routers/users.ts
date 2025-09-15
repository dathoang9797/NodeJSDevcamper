import express from 'express';
import { advancedResults } from '#src/middleware/advancedResult.ts';
import { authorized, protect } from '#src/middleware/auth.ts';
import { CreateUser, GetUser, GetUsers, UpdateUser, DeleteUser } from '#src/controllers/users.ts';
import UserModel from '#src/models/user.ts';

const router = express.Router();

router.use(protect);
router.use(authorized('admin'));

router.route('/')
    .get(advancedResults(UserModel), GetUsers)
    .post(CreateUser);

router.route('/:id')
    .get(GetUser)
    .put(UpdateUser)
    .delete(DeleteUser)
    ;

export default router;
