import { z } from "zod";

import type { IUseCase } from "../../interfaces/usecase.interface";
import { User } from "../../models/user/user.model";
import { UserRepository } from "../../repositories/user.repository";

export class GetUserByIdUseCase implements IUseCase<string, User> {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  execute(id: string) {
    const idValidation = z.string().min(1);
    const validatedId = idValidation.parse(id);

    const user = this.userRepository.findById(validatedId);
    if (!user) {
      throw new Error("User not found");
    }

    return User.parse(user);
  }
}

export const setupGetUserByIdUseCase = () => {
  const userRepository = new UserRepository();
  return new GetUserByIdUseCase(userRepository);
};
