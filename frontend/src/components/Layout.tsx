import { Outlet } from "react-router-dom";
import { Component as Sidebar } from "./Sidebar";

export function Layout() {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0">
                <Sidebar />
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}