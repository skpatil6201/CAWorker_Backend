"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirmAssignmentRequests = exports.createAssignmentRequest = void 0;
const assignmentRequest_model_1 = __importDefault(require("../models/assignmentRequest.model"));
const response_1 = require("../utils/response");
const createAssignmentRequest = async (req, res) => {
    var _a;
    try {
        const firmId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { firmName, firmRegistrationNumber, contactPersonName, mobileNumber, email, officeAddress, cityStatePin, assignmentType, assignmentTypeOther, industryNatureOfBusiness, assignmentLocation, expectedStartDate, expectedDuration, workingHours, auditorsRequired, experienceRequired, skillsRequired, paymentToAuditor, accommodationTravelProvided, agreedToServiceCharges, declaration } = req.body;
        if (!firmId) {
            return (0, response_1.sendError)(res, 'Firm authentication required', undefined, 401);
        }
        const assignmentRequest = new assignmentRequest_model_1.default({
            firmId,
            firmName,
            firmRegistrationNumber,
            contactPersonName,
            mobileNumber,
            email,
            officeAddress,
            cityStatePin,
            assignmentType,
            assignmentTypeOther,
            industryNatureOfBusiness,
            assignmentLocation,
            expectedStartDate,
            expectedDuration,
            workingHours,
            auditorsRequired,
            experienceRequired,
            skillsRequired,
            paymentToAuditor,
            accommodationTravelProvided,
            agreedToServiceCharges,
            declaration,
            status: 'pending'
        });
        const savedRequest = await assignmentRequest.save();
        (0, response_1.sendSuccess)(res, 'Assignment request created successfully', savedRequest, 201);
    }
    catch (error) {
        (0, response_1.sendError)(res, 'Failed to create assignment request', error.message, 500);
    }
};
exports.createAssignmentRequest = createAssignmentRequest;
const getFirmAssignmentRequests = async (req, res) => {
    var _a;
    try {
        const firmId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!firmId) {
            return (0, response_1.sendError)(res, 'Firm authentication required', undefined, 401);
        }
        const requests = await assignmentRequest_model_1.default.find({ firmId }).sort({ createdAt: -1 });
        (0, response_1.sendSuccess)(res, 'Assignment requests retrieved successfully', requests);
    }
    catch (error) {
        (0, response_1.sendError)(res, 'Failed to retrieve assignment requests', error.message, 500);
    }
};
exports.getFirmAssignmentRequests = getFirmAssignmentRequests;
