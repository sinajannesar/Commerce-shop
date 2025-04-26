import { User } from "@/types/types";

export default function ProfileHeader({ user }: { user: User }) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-10">
      <div className="flex justify-center">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white/20 bg-gray-700">
          <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white">
            {user.firstname && user.lastname ? `${user.firstname[0]}${user.lastname[0]}` : "?"}
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h1 className="text-2xl font-bold text-white">
          {user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : "User Profile"}
        </h1>
        <p className="text-indigo-200">
          Member since{" "}
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US") : "Unknown"}
        </p>
      </div>
    </div>
  );
}
