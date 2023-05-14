export class PezzoClientError extends Error {
  constructor(
    message,
    private error,
    private statusCode: number | null = null
  ) {
    super(message);
    this.error = error;
    this.statusCode = statusCode;
  }
}
