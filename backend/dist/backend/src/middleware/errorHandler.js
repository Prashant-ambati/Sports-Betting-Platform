"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.createError = exports.errorHandler = void 0;
const errorHandler = (error, req, res) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    console.error('Error:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    const errorResponse = {
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? (statusCode === 500 ? 'Internal Server Error' : message)
            : message,
        ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    };
    res.status(statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};
exports.createError = createError;
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`
    });
};
exports.notFound = notFound;
//# sourceMappingURL=errorHandler.js.map