const responseStatus = require('./responseStatus');

class Index {
  static createResponse(status, message, data = {}, errors = []) {
    return {
      status,
      message,
      data: Array.isArray(data) || Object.keys(data).length ? data : Array.isArray(data) ? [] : {},
      errors,
    };
  }

  static generateResponse(type, defaultMessage, data = {}) {
    return this.createResponse(
      responseStatus[type],
      data.message ?? defaultMessage,
      data.data || {},
      data.errors || []
    );
  }

  static success(data = {}) {
    return this.generateResponse(responseStatus.success, 'Your request is successfully executed', data);
  }

  static created(data = {}) {
    return this.generateResponse(responseStatus.created, 'Resource successfully created', data);
  }

  static accepted(data = {}) {
    return this.generateResponse(responseStatus.accepted, 'Some error occurred while performing action.', data);
  }

  static noContent() {
    return this.createResponse(responseStatus.noContent, 'No content');
  }

  static badRequest(data = {}) {
    return this.generateResponse(responseStatus.badRequest, 'Invalid request', data);
  }

  static unAuthorized(data = {}) {
    return this.generateResponse(responseStatus.unauthorized, 'Authentication failed', data);
  }

  static forbidden(data = {}) {
    return this.generateResponse(responseStatus.forbidden, 'Access denied', data);
  }

  static notFound(data = {}) {
    return this.createResponse(responseStatus.notFound, data.message ?? 'Resource not found',
      Array.isArray(data.data) ? [] : {},
      data.errors || []
    );
  }

  static validationError(data = {}) {
    return this.generateResponse(responseStatus.validationError, 'Validation error', data);
  }

  static toManyRequest(data = {}) {
    return this.generateResponse(responseStatus.toManyRequest, 'Too many requests. Please try again later.', data);
  }

  static internalServerError(data = {}) {
    return this.generateResponse(responseStatus.internalServerError, 'An unexpected error occurred', data);
  }

  static serviceUnavailable(data = {}) {
    return this.generateResponse(responseStatus.serviceUnavailable, 'Service is temporarily unavailable', data);
  }
}

module.exports = Index;