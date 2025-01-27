module.exports = {
  // Success Codes
  success: 200, // OK
  created: 201, // Resource created
  accepted: 202, // Resource created
  noContent: 204, // No content for delete operations

  // Client Errors
  badRequest: 400, // Invalid request
  unAuthorized: 401, // Authentication failure
  forbidden: 403, // Authorization failure
  notFound: 404, // Resource not found
  validationError: 422, // Validation errors
  toManyRequest: 429, // Validation errors

  // Server Errors
  internalServerError: 500, // Generic server error
  serviceUnavailable: 503, // Server unavailable
};
