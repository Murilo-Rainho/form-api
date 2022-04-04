import { UserResponseData } from '../../domain/models';
import { UserRequestData } from '../../domain/usecases';

export interface CreateUserRepository {
  createOne(userData: UserRequestData): Promise<UserResponseData>;
}
