export class MissingParamError extends Error {
  public name: string;

  constructor(paramName: string) {
    super(`Missing param: ${paramName}`);
    this.name = 'MissingParamError';
  }
}
