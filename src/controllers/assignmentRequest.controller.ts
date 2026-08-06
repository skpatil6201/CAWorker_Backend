import { Request, Response } from 'express';
import AssignmentRequest from '../models/assignmentRequest.model';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export const createAssignmentRequest = async (req: AuthRequest, res: Response) => {
  try {
    const firmId = req.user?.id;
    const {
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
      declaration
    } = req.body;

    if (!firmId) {
      return sendError(res, 'Firm authentication required', undefined, 401);
    }

    const assignmentRequest = new AssignmentRequest({
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
    sendSuccess(res, 'Assignment request created successfully', savedRequest, 201);
  } catch (error) {
    sendError(res, 'Failed to create assignment request', (error as Error).message, 500);
  }
};

export const getFirmAssignmentRequests = async (req: AuthRequest, res: Response) => {
  try {
    const firmId = req.user?.id;
    if (!firmId) {
      return sendError(res, 'Firm authentication required', undefined, 401);
    }

    const requests = await AssignmentRequest.find({ firmId }).sort({ createdAt: -1 });
    sendSuccess(res, 'Assignment requests retrieved successfully', requests);
  } catch (error) {
    sendError(res, 'Failed to retrieve assignment requests', (error as Error).message, 500);
  }
};
