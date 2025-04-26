"use client";
import dynamic from "next/dynamic";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "@/types/types";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";


const Loading = dynamic(() => import("@/components/profile/Loading"), { ssr: false });
const Unauthenticated = dynamic(() => import("@/components/profile/Unauthenticated"), { ssr: false });
const NoData = dynamic(() => import("@/components/profile/NoData"), { ssr: false });
const ProfileHeader = dynamic(() => import("@/components/profile/ProfileHeader"), { ssr: false });
const ProfileInfoItem = dynamic(() => import("@/components/profile/ProfileInfoItem"), { ssr: false });
// const CompleteProfileButton = dynamic(() => import("@/components/profile/CompleteProfileButton"), { ssr: false });
const MMProfileModal = dynamic(() => import("@/components/profile/MMProfileModal"), {ssr:false})
export default function ProfilePage() {
  const { status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user")
        .then((res) => res.ok && res.json())
        .then((data) => setUser(data));
    }
  }, [status]);

  if (status === "loading" || !user ) return <Loading />;
  if (status === "unauthenticated") return <Unauthenticated />;
  if (!user) return <NoData/>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <div className="overflow-hidden rounded-2xl bg-gray-800 shadow-xl">
          <ProfileHeader user={user} />
          <div className="divide-y divide-gray-700 px-6 py-4">
            <ProfileInfoItem icon={<MailIcon className="h-5 w-5" />} label="Email" value={user.email} />
            <ProfileInfoItem icon={<PhoneIcon className="h-5 w-5" />} label="Phone" value={user.phonenumber ? String(user.phonenumber) : "Not provided"} />
            <ProfileInfoItem icon={<MapPinIcon className="h-5 w-5" />} label="Address" value={user.address || "Not provided"} />
          </div>
          {/* <CompleteProfileButton /> */}
          <MMProfileModal user={user}/>
        </div>
      </div>
    </div>
  );
}
