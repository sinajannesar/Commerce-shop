"use client";

import { User } from "@/types/types";
import ProfileHeader from "./ProfileHeader";
import ProfileInfoItem from "./ProfileInfoItem";
// import CompleteProfileButton from "./CompleteProfileButton";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import ProfileModal from "./MMProfileModal";

export default function ProfileContent({ user }: { user: User }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <div className="overflow-hidden rounded-2xl bg-gray-800 shadow-xl">
          <ProfileHeader user={user} />
          <div className="divide-y divide-gray-700 px-6 py-4">
            <ProfileInfoItem icon={<MailIcon className="h-5 w-5" />} label="Email" value={user.email} />
            <ProfileInfoItem icon={<PhoneIcon className="h-5 w-5" />} label="Phone" value={user.phonenumber || "Not provided"} />
            <ProfileInfoItem icon={<MapPinIcon className="h-5 w-5" />} label="Address" value={user.address || "Not provided"} />
          </div>
          <ProfileModal user={user} />

        </div>
      </div>
    </div>
  );
}
