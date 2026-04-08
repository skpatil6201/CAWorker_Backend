"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGalleryImagesByCategory = exports.toggleGalleryImageStatus = exports.deleteGalleryImage = exports.updateGalleryImage = exports.createGalleryImage = exports.getGalleryImageById = exports.getAllGalleryImages = void 0;
const gallery_model_1 = require("../models/gallery.model");
const express_validator_1 = require("express-validator");
// Get all gallery images
const getAllGalleryImages = async (req, res) => {
    try {
        const { category, isActive } = req.query;
        // Build filter object
        const filter = {};
        if (category)
            filter.category = category;
        if (isActive !== undefined)
            filter.isActive = isActive === 'true';
        const images = await gallery_model_1.Gallery.find(filter)
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({
            success: true,
            message: 'Gallery images retrieved successfully',
            data: images,
            count: images.length
        });
    }
    catch (error) {
        console.error('Error fetching gallery images:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch gallery images',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getAllGalleryImages = getAllGalleryImages;
// Get single gallery image by ID
const getGalleryImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await gallery_model_1.Gallery.findById(id);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Gallery image not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Gallery image retrieved successfully',
            data: image
        });
    }
    catch (error) {
        console.error('Error fetching gallery image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch gallery image',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getGalleryImageById = getGalleryImageById;
// Create new gallery image
const createGalleryImage = async (req, res) => {
    try {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { title, description, category, src, alt, isActive } = req.body;
        const newImage = new gallery_model_1.Gallery({
            title,
            description,
            category,
            src,
            alt: alt || title,
            isActive: isActive !== undefined ? isActive : true
        });
        const savedImage = await newImage.save();
        res.status(201).json({
            success: true,
            message: 'Gallery image created successfully',
            data: savedImage
        });
    }
    catch (error) {
        console.error('Error creating gallery image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create gallery image',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createGalleryImage = createGalleryImage;
// Update gallery image
const updateGalleryImage = async (req, res) => {
    try {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { id } = req.params;
        const { title, description, category, src, alt, isActive } = req.body;
        const updatedImage = await gallery_model_1.Gallery.findByIdAndUpdate(id, {
            title,
            description,
            category,
            src,
            alt: alt || title,
            isActive
        }, { new: true, runValidators: true });
        if (!updatedImage) {
            return res.status(404).json({
                success: false,
                message: 'Gallery image not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Gallery image updated successfully',
            data: updatedImage
        });
    }
    catch (error) {
        console.error('Error updating gallery image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update gallery image',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateGalleryImage = updateGalleryImage;
// Delete gallery image
const deleteGalleryImage = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedImage = await gallery_model_1.Gallery.findByIdAndDelete(id);
        if (!deletedImage) {
            return res.status(404).json({
                success: false,
                message: 'Gallery image not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Gallery image deleted successfully',
            data: deletedImage
        });
    }
    catch (error) {
        console.error('Error deleting gallery image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete gallery image',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.deleteGalleryImage = deleteGalleryImage;
// Toggle gallery image active status
const toggleGalleryImageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await gallery_model_1.Gallery.findById(id);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Gallery image not found'
            });
        }
        image.isActive = !image.isActive;
        const updatedImage = await image.save();
        res.status(200).json({
            success: true,
            message: `Gallery image ${updatedImage.isActive ? 'activated' : 'deactivated'} successfully`,
            data: updatedImage
        });
    }
    catch (error) {
        console.error('Error toggling gallery image status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle gallery image status',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.toggleGalleryImageStatus = toggleGalleryImageStatus;
// Get gallery images by category
const getGalleryImagesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const images = await gallery_model_1.Gallery.find({
            category: category.toLowerCase(),
            isActive: true
        })
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({
            success: true,
            message: `Gallery images for category '${category}' retrieved successfully`,
            data: images,
            count: images.length
        });
    }
    catch (error) {
        console.error('Error fetching gallery images by category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch gallery images by category',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getGalleryImagesByCategory = getGalleryImagesByCategory;
