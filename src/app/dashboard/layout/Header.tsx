import React, { useEffect, useState } from 'react'
import { Icon } from "@iconify/react"
import { useAppDispatch } from '@/app/redux/store/hooks';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/redux/features/authSlice';
import Cookies from "js-cookie";
import Link from 'next/link';

interface User {
    name: string;
    email: string;
    role: {
        name: string;
    };
}

const Header = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [menuOpen, setMenuOpen] = useState(false);

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('user');
        Cookies.remove("token");
        router.push("/login");
    };

    return (
        <nav className="bg-gray-800 text-white">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
                {/* Left Section: Logo and Menu */}
                <div className="flex items-center space-x-6">
                    {/* Logo */}
                    <Link href="/dashboard" className="text-lg font-bold">
                        ClapNest
                    </Link>
                    {/* Menu Links (Desktop) */}
                    <ul className="hidden lg:flex space-x-6">
                        <li>
                            <Link href="/dashboard" className="hover:text-gray-300 font-medium">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/chat" className="hover:text-gray-300 font-medium">
                                Chat
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Right Section: Hamburger + User Info + Logout */}
                <div className="flex items-center space-x-4">
                    {/* Hamburger Menu (Mobile) */}
                    <button
                        className="text-white lg:hidden"
                        aria-label="Toggle navigation"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <Icon icon="solar:hamburger-menu-line-duotone" height={24} />
                    </button>

                    {/* User Info and Logout (Desktop) */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <span>
                            {user?.name} | {user?.role.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="lg:hidden mt-4 px-4 pb-2">
                    <ul className="flex flex-col space-y-2">
                        <li>
                            <Link href="/dashboard" className="block text-white hover:text-gray-300">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/chat" className="block text-white hover:text-gray-300">
                                Chat
                            </Link>
                        </li>
                    </ul>
                    {/* User Info and Logout (Mobile) */}
                    <div className="mt-4 border-t border-gray-700 pt-4">
                        <span className="block mb-2">
                            {user?.name} | {user?.role.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm w-full text-center"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Header