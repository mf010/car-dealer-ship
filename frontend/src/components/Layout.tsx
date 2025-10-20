import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Component as Sidebar } from "./Sidebar";
import { HiMenu, HiX } from "react-icons/hi";

export function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle sidebar"
            >
                {isSidebarOpen ? (
                    <HiX className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                ) : (
                    <HiMenu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                )}
            </button>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-40
                    w-64 flex-shrink-0 overflow-y-auto
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <Sidebar onNavigate={closeSidebar} />
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-6 lg:p-6 pt-20 lg:pt-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}