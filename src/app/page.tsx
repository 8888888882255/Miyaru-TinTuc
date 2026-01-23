import dbConnect from "@/lib/db";
import User from "@/models/User";
import HomePage from "@/components/home-page";
import { User as UserType } from "@/types/user";

export const dynamic = 'force-dynamic';

export default async function Page() {
  await dbConnect();
  
  // Use lean() for performance since we just need plain objects
  const users = await User.find({}).sort({ createdAt: -1 }).lean();

  // Serialize Mongoose documents to plain JSON and ensure _id is handled
  const serializedUsers: UserType[] = JSON.parse(JSON.stringify(users)).map((u: UserType) => ({
    ...u,
    id: u._id, // Ensure id is available
    // Ensure dates are strings if they aren't already (JSON.stringify handles Date objects to ISO strings)
  }));

  return <HomePage initialUsers={serializedUsers} />;
}
