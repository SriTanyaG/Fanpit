'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'brand_owner':
        return 'Brand Owner';
      case 'attendee':
        return 'Attendee';
      case 'admin':
        return 'Admin';
      default:
        return role;
    }
  };

  const getDashboardLink = () => {
    if (user?.role === 'brand_owner') {
      return '/dashboard';
    } else if (user?.role === 'attendee') {
      return '/bookings';
    }
    return '/profile';
  };

  return (
    <header className="bg-white py-4 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-[#7C3AED]">Fanpit</span>
          <span className="ml-2 text-2xl">💜</span>
        </Link>

        {/* Center Navigation */}
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className={`text-base ${
              pathname === '/'
                ? 'rounded-full bg-[#7C3AED] px-6 py-2 text-white'
                : 'text-gray-600 hover:text-[#7C3AED]'
            }`}
          >
            Browse Spaces
          </Link>
          {user?.role === 'brand_owner' && (
            <Link
              href="/dashboard"
              className={`text-base ${
                pathname.startsWith('/dashboard')
                  ? 'text-[#7C3AED]'
                  : 'text-gray-600 hover:text-[#7C3AED]'
              }`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-6">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 rounded-lg p-2 hover:bg-gray-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C3AED] text-lg font-semibold text-white">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name || 'User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.role ? getRoleDisplayName(user.role) : 'User'}
                  </div>
                </div>
                <svg
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    showProfileMenu ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <Link
                    href={getDashboardLink()}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    {user.role === 'brand_owner' ? 'Dashboard' : 'My Bookings'}
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Profile Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-[#7C3AED]"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-[#7C3AED] px-4 py-2 text-white hover:bg-[#6D28D9]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}