interface Props {
    icon: React.ReactNode;
    label: string;
    value: string;
  }
  
  export default function ProfileInfoItem({ icon, label, value }: Props) {
    return (
      <div className="flex items-center py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-900/30 text-indigo-400">
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-400">{label}</p>
          <p className="text-base text-white">{value}</p>
        </div>
      </div>
    );
  }
  