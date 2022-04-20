export class ServerError extends Error {
  public name: string;

  constructor(stack: string) {
    super('Something went wrong');
    this.name = 'ServerError';
    this.stack = stack;
  }
}
