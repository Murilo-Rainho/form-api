export class InvalidParamError extends Error {
  public name: string;

  constructor(paramName: string) {
    super(`Invalid param: ${paramName}`);
    this.name = 'InvalidParamError';
  }
}
