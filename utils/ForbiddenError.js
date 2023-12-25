class ForbiddenError extends Error {
  constructor(message) {
    super();
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    this.message = message;
  }
}

module.exports = ForbiddenError;
