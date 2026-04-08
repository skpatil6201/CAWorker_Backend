"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gallery_controller_1 = require("../controllers/gallery.controller");
const gallery_validator_1 = require("../validators/gallery.validator");
const auth_middleware_1 = require("../middleware/auth.middleware");
const adminAuth_1 = require("../middleware/adminAuth");
const router = (0, express_1.Router)();
// Public routes (no authentication required)
router.get('/', gallery_validator_1.validateGalleryQuery, gallery_controller_1.getAllGalleryImages);
router.get('/category/:category', gallery_validator_1.validateGetGalleryImagesByCategory, gallery_controller_1.getGalleryImagesByCategory);
router.get('/:id', gallery_validator_1.validateGetGalleryImageById, gallery_controller_1.getGalleryImageById);
// Protected routes (admin only)
router.use(auth_middleware_1.authenticateToken); // Apply authentication to all routes below
router.use(adminAuth_1.requireAdmin); // Apply admin authorization to all routes below
router.post('/', gallery_validator_1.validateCreateGalleryImage, gallery_controller_1.createGalleryImage);
router.put('/:id', gallery_validator_1.validateUpdateGalleryImage, gallery_controller_1.updateGalleryImage);
router.delete('/:id', gallery_validator_1.validateDeleteGalleryImage, gallery_controller_1.deleteGalleryImage);
router.patch('/:id/toggle-status', gallery_validator_1.validateToggleGalleryImageStatus, gallery_controller_1.toggleGalleryImageStatus);
exports.default = router;
