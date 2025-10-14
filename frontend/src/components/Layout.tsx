import { Outlet } from "react-router-dom";
import { Component as Sidebar } from "./Sidebar";

export function Layout() {
    return <div>
        <Sidebar />
        <Outlet />
    </div>;
}