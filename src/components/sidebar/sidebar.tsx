"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    ShoppingBag,
    ShoppingCart,
    Users,
    LogOut,
    ChevronRight,
    
    Star,
} from "lucide-react";

export default function ProfessionalSidebar() {
    const [isHovered, setIsHovered] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const pathname = usePathname();

    const isPathActive = (path: string) => {
        return pathname === path || pathname?.startsWith(path + "/");
    };

    const toggleSubmenu = (name: string) => {
        setActiveSubmenu(activeSubmenu === name ? null : name);
    };

    const menuItems = [
        {
            name: "Dashboard",
            icon: <Home size={20} />,
            path: "/dashboard",
        },

        {
            name: "Products",
            icon: <ShoppingBag size={20} />,
            path: "/products",
            submenu: [
                { name: "All Products", path: "/" },
                { name: "Add Product", path: "/products/add" },
            
            ],
        },
        {
            name: "Orders",
            icon: <ShoppingCart size={20} />,
            path: "/orders",
            badge: "12",
            submenu: [
                { name: "All Orders", path: "/orders" },
                { name: "Pending", path: "/orders/pending" },
                { name: "Delivered", path: "/orders/delivered" },
            ],
        },
        {
            name: "Setting",
            icon: <Users size={20} />,
            path: "/customers",
        },

    ];


    const isCollapsed = !isHovered;

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`fixed inset-y-0 left-0 z-30 bg-gradient-to-b from-blue-900 to-indigo-900 text-white shadow-lg transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-72"
                }`}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-indigo-800/50">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                            <Star className="h-5 w-5 text-indigo-600" />
                        </div>
                        {!isCollapsed && (
                            <span className="font-bold text-xl tracking-tight">ShopAdmin</span>
                        )}
                    </Link>
                </div>

                
                {/* Menu */}
                <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-transparent py-4 px-3">
                    {!isCollapsed && (
                        <p className="text-xs text-indigo-300 font-semibold uppercase mb-3">
                            Main Menu
                        </p>
                    )}
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                {item.submenu ? (
                                    <div>
                                        <button
                                            onClick={() => toggleSubmenu(item.name)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-indigo-800/50 ${isPathActive(item.path) ? "bg-indigo-700" : ""
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span>{item.icon}</span>
                                                {!isCollapsed && <span>{item.name}</span>}
                                            </div>
                                            {!isCollapsed && (
                                                <ChevronRight
                                                    className={`transition-transform ${activeSubmenu === item.name ? "rotate-90" : ""
                                                        }`}
                                                    size={16}
                                                />
                                            )}
                                        </button>
                                        {!isCollapsed && activeSubmenu === item.name && (
                                            <ul className="ml-5 mt-1 space-y-1">
                                                {item.submenu.map((sub) => (
                                                    <li key={sub.name}>
                                                        <Link
                                                            href={sub.path}
                                                            className={`block p-2 rounded hover:bg-indigo-800/30 text-sm ${pathname === sub.path
                                                                    ? "text-white font-medium"
                                                                    : "text-indigo-200"
                                                                }`}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={item.path}
                                        className={`flex items-center p-3 rounded-lg hover:bg-indigo-800/50 ${isPathActive(item.path)
                                                ? "bg-indigo-700 text-white"
                                                : "text-indigo-200"
                                            }`}
                                    >
                                        <span>{item.icon}</span>
                                        {!isCollapsed && <span className="ml-3">{item.name}</span>}
                                        {item.badge && !isCollapsed && (
                                            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-pink-500 text-white">

                                            </span>
                                        )}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Bottom */}
                <div className="p-4 border-t border-indigo-800/50">
                    <Link
                        href="/"
                        className="flex items-center p-3 rounded-lg hover:bg-indigo-800/50 text-indigo-200"
                    >
                        <LogOut size={20} />
                        {!isCollapsed && <span className="ml-3">Logout</span>}
                    </Link>
                </div>
            </div>
        </div>
    );
}
