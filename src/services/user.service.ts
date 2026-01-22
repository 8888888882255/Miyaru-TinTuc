import { User } from "@/models/user.model";

export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}

export async function createUser(data: any) {
  return User.create(data);
}
