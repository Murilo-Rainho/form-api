import { Validation } from './validation';

export class ValidationComposite implements Validation {
  private readonly validation: Validation[];

  constructor(validations: Validation[]) {
    this.validation = validations;
  }

  validate(input: any): Error {
    for (const validation of this.validation) {
      const error = validation.validate(input);

      if (error) return error;
    }
  }
}
