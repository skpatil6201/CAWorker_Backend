import { Request, Response } from 'express';
import { Service } from '../models/service.model';

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: services });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
};

export const getAllServicesAdmin = async (req: Request, res: Response) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: services });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { title, description, image, details, order } = req.body;
    const service = await new Service({ title, description, image, details: details || [], order: order || 0 }).save();
    res.status(201).json({ success: true, data: service });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to create service' });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { title, description, image, details, isActive, order } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { title, description, image, details, isActive, order },
      { new: true, runValidators: true }
    );
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to update service' });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service deleted' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to delete service' });
  }
};
