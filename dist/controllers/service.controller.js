"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.createService = exports.getAllServicesAdmin = exports.getAllServices = void 0;
const service_model_1 = require("../models/service.model");
const getAllServices = async (req, res) => {
    try {
        const services = await service_model_1.Service.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: services });
    }
    catch (e) {
        res.status(500).json({ success: false, message: 'Failed to fetch services' });
    }
};
exports.getAllServices = getAllServices;
const getAllServicesAdmin = async (req, res) => {
    try {
        const services = await service_model_1.Service.find().sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: services });
    }
    catch (e) {
        res.status(500).json({ success: false, message: 'Failed to fetch services' });
    }
};
exports.getAllServicesAdmin = getAllServicesAdmin;
const createService = async (req, res) => {
    try {
        const { title, description, image, details, order } = req.body;
        const service = await new service_model_1.Service({ title, description, image, details: details || [], order: order || 0 }).save();
        res.status(201).json({ success: true, data: service });
    }
    catch (e) {
        res.status(500).json({ success: false, message: 'Failed to create service' });
    }
};
exports.createService = createService;
const updateService = async (req, res) => {
    try {
        const { title, description, image, details, isActive, order } = req.body;
        const service = await service_model_1.Service.findByIdAndUpdate(req.params.id, { title, description, image, details, isActive, order }, { new: true, runValidators: true });
        if (!service)
            return res.status(404).json({ success: false, message: 'Service not found' });
        res.json({ success: true, data: service });
    }
    catch (e) {
        res.status(500).json({ success: false, message: 'Failed to update service' });
    }
};
exports.updateService = updateService;
const deleteService = async (req, res) => {
    try {
        const service = await service_model_1.Service.findByIdAndDelete(req.params.id);
        if (!service)
            return res.status(404).json({ success: false, message: 'Service not found' });
        res.json({ success: true, message: 'Service deleted' });
    }
    catch (e) {
        res.status(500).json({ success: false, message: 'Failed to delete service' });
    }
};
exports.deleteService = deleteService;
