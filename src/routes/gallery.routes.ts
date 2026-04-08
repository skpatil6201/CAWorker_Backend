import { Router } from 'express';
import {
  getAllGalleryImages,
  getGalleryImageById,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  toggleGalleryImageStatus,
  getGalleryImagesByCategory
} from '../controllers/gallery.controller';
import {
  validateCreateGalleryImage,
  validateUpdateGalleryImage,
  validateGetGalleryImageById,
  validateDeleteGalleryImage,
  validateToggleGalleryImageStatus,
  validateGetGalleryImagesByCategory,
  validateGalleryQuery
} from '../validators/gallery.validator';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/adminAuth';

const router = Router();

// Public routes (no authentication required)
router.get('/', validateGalleryQuery, getAllGalleryImages);
router.get('/category/:category', validateGetGalleryImagesByCategory, getGalleryImagesByCategory);
router.get('/:id', validateGetGalleryImageById, getGalleryImageById);

// Protected routes (admin only)
router.use(authenticateToken); // Apply authentication to all routes below
router.use(requireAdmin); // Apply admin authorization to all routes below

router.post('/', validateCreateGalleryImage, createGalleryImage);
router.put('/:id', validateUpdateGalleryImage, updateGalleryImage);
router.delete('/:id', validateDeleteGalleryImage, deleteGalleryImage);
router.patch('/:id/toggle-status', validateToggleGalleryImageStatus, toggleGalleryImageStatus);

export default router;