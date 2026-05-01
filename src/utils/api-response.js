class ApiResponse {
  constructor(statusCode, data, message, metaData) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message || "Request successfully served";
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
