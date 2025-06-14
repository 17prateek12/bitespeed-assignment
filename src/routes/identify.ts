import express from 'express';
import { identifyContact } from '../controller/identifyController';

const router = express.Router();

router.route('/').post(identifyContact);

export default router;
