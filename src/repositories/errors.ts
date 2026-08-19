export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class SchemaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SchemaError';
  }
}
