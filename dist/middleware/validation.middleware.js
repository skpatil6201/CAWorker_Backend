"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const response_1 = require("../utils/response");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        return (0, response_1.sendError)(res, 'Validation failed', errorMessages, 400);
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
