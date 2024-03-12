import type { User } from "../models/user/user.model";

// Mock user data
const mockUsers: User[] = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Doe" },
];

export class UserRepository {
  findById(id: string): User | undefined {
    const user = mockUsers.find((user) => user.id === id);
    return user;
  }

  // Other repository methods
}
