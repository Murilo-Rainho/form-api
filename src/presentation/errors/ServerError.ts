export class ServerError extends Error {
  public name: string;

  constructor() {
    super('Something went wrong');
    this.name = 'ServerError';
  }
}
