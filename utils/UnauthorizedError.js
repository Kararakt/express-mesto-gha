class UnauthorizedError extends Error {
  constructor(message) {
    super();
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
    this.message = message;
  }
}

module.exports = UnauthorizedError;
