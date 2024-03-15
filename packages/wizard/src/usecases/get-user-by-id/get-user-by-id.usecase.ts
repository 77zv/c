import { z } from "zod";

import type { IUseCase } from "../../interfaces/usecase.interface";
import type { User } from "../../models/user/user.model";
import { UserRepository } from "../../repositories/user.repository";

export class GetUserByIdUseCase implements IUseCase<string, User> {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  execute(id: string) {
    const user = this.userRepository.findById(id);

    if (user === undefined) {
      throw new Error("User not found");
    }

    return user;
  }
}

export const setupGetUserByIdUseCase = () => {
  const userRepository = new UserRepository();
  return new GetUserByIdUseCase(userRepository);
};
