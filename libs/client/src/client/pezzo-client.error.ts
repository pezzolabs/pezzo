export class PezzoClientError<T> extends Error {
  constructor(
    message: string,
    private error: T,
    private statusCode: number | null = null
  ) {
    super(message);
    this.error = error;
    this.statusCode = statusCode;
  }
}
