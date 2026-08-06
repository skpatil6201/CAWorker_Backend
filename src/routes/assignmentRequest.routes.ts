import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { createAssignmentRequest, getFirmAssignmentRequests } from '../controllers/assignmentRequest.controller';

const router = Router();

router.post('/assignment-requests', authenticateToken, authorizeRoles('firm', 'Firm', 'SuperAdmin', 'Admin'), createAssignmentRequest);
router.get('/assignment-requests/firm',getFirmAssignmentRequests);

export default router;
