import { Router } from 'express';
import { registerTask, getTasks, deleteTask, editTask, getExecutedTasks } from './taskController';

const router = Router();

router.post('/tasks', registerTask);
router.get('/tasks', getTasks);
router.put('/tasks/:id', editTask);
router.delete('/tasks/:id', deleteTask);
router.get('/tasks/executed', getExecutedTasks);

export default router;
