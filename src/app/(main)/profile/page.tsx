import { currentUser } from "@clerk/nextjs/server";

export default async function ProfilePage() {
  const user = await currentUser();
  
  return (
    <div className="container mx-auto max-w-5xl py-10">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold mb-2">
          {user?.username || user?.firstName || "User Profile"}
        </h1>
      </div>
    </div>
  );
}
