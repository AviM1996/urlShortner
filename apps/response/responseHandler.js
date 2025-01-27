const responseBody = require('./index');
const responseCode = require('./responseCode');

const responseHandler = (req, res, next) => {
  const createResponseMethod = (methodName, statusCode) => {
    res[methodName] = (data = {}) => {
      res.status(statusCode).json(responseBody[methodName](data));
    };
  };

  const responseMethods = {
    success: responseCode.success, // 200
    created: responseCode.created, // 201
    accepted: responseCode.accepted, // 202
    noContent: responseCode.noContent, // 204
    badRequest: responseCode.badRequest, // 400
    unAuthorized: responseCode.unAuthorized, // 401
    forbidden: responseCode.forbidden, // 403
    notFound: responseCode.notFound, // 404
    validationError: responseCode.validationError, // 422
    toManyRequest: responseCode.toManyRequest, // 429
    internalServerError: responseCode.internalServerError, // 500
    serviceUnavailable: responseCode.serviceUnavailable, // 503
  };

  for (const [methodName, statusCode] of Object.entries(responseMethods)) {
    createResponseMethod(methodName, statusCode);
  }

  next();
};

module.exports = responseHandler;
