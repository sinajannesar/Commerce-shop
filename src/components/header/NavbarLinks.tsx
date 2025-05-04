import Link from "next/link";

export function NavbarLinks() {
  const links = [
    { label: "Home", href: "#" },
    { label: "Features", href: "#" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Resources", href: "#" },
    { label: "Contact", href: "#" },
  ];

  return (
    <div className="hidden md:flex ml-10 items-center space-x-6">
      {links.map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          className="relative px-4 py-2 text-sm font-medium text-gray-100 hover:text-white transition-all duration-300 group"
        >
          {label}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
        </Link>
      ))}
    </div>
  );
}
