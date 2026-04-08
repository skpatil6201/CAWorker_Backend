import { Router } from 'express';
import { getAllServices, getAllServicesAdmin, createService, updateService, deleteService } from '../controllers/service.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/adminAuth';

const router = Router();

router.get('/', getAllServices);

router.use(authenticateToken, requireAdmin);
router.get('/admin/all', getAllServicesAdmin);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;
