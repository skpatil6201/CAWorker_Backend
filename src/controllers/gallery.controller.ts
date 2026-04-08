import { Request, Response } from 'express';
import { Gallery, IGallery } from '../models/gallery.model';
import { validationResult } from 'express-validator';

// Get all gallery images
export const getAllGalleryImages = async (req: Request, res: Response) => {
  try {
    const { category, isActive } = req.query;
    
    // Build filter object
    const filter: any = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const images = await Gallery.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      message: 'Gallery images retrieved successfully',
      data: images,
      count: images.length
    });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get single gallery image by ID
export const getGalleryImageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const image = await Gallery.findById(id);
    
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
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create new gallery image
export const createGalleryImage = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, category, src, alt, isActive } = req.body;

    const newImage = new Gallery({
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
  } catch (error) {
    console.error('Error creating gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create gallery image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update gallery image
export const updateGalleryImage = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { title, description, category, src, alt, isActive } = req.body;

    const updatedImage = await Gallery.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        src,
        alt: alt || title,
        isActive
      },
      { new: true, runValidators: true }
    );

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
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete gallery image
export const deleteGalleryImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedImage = await Gallery.findByIdAndDelete(id);

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
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Toggle gallery image active status
export const toggleGalleryImageStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const image = await Gallery.findById(id);
    
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
  } catch (error) {
    console.error('Error toggling gallery image status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle gallery image status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get gallery images by category
export const getGalleryImagesByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    
    const images = await Gallery.find({ 
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
  } catch (error) {
    console.error('Error fetching gallery images by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images by category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};