class ApiResponse {
  constructor(statusCode, data, message) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message || "Request successfully served";
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
