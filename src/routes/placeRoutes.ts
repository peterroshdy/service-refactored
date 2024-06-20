import { Router } from 'express';
import multer from 'multer';
import placeController from '../controllers/placeController';
import authenticateToken from '../middlewares/authenticateToken';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/ping', (req, res) => res.send('pong'));
router.post('/get-place', authenticateToken, upload.none(), placeController.getPlace);

export default router;
