import { Router } from "express";
import authController from "./controllers/authController"
import userController from "./controllers/userControllers"
import participantController from "./controllers/participantController";
import subcriptionController from "./controllers/subscriptionController"
import {Limit} from './middleware/limiter'

const router = Router();


// Subscription
router.get('/',subcriptionController.getWelcomeMessage);


// Auth
router.post('/sign-up', authController.sign);
router.post('/sign-in', Limit(3,'Várias tentativas foram detectadas! Volte a tentar mais tarde'), authController.login);
router.patch('/change-password', authController.changePassword);


// Participant
router.get('/participants', participantController.listAll);
router.post('/participant', participantController.create);
router.patch('/participant/:id', participantController.update);
router.delete('/participant/:id', participantController.delete);



export default router;