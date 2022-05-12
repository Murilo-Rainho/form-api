export class UnauthorizedError extends Error {
  public name: string;

  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}
