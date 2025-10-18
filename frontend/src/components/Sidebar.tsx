
"use client";
import { Component as UserCard } from "../Pages/userPages/userCard";
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";

export function Component() {
  return (
    <Sidebar 
      aria-label="Main navigation sidebar" 
      className="h-screen fixed left-0 top-0 z-40 shadow-lg border-r border-gray-200 dark:border-gray-700"
    >
      <SidebarItems className="h-full flex flex-col">
        {/* User Profile Section */}
        <SidebarItemGroup className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <SidebarItem href="#" className="hover:bg-transparent cursor-default">
            <div className="flex justify-center w-full">
              <UserCard />
            </div>
          </SidebarItem>
        </SidebarItemGroup>

        {/* Main Navigation */}
        <SidebarItemGroup className="flex-1">
          <SidebarItem 
            href="dashboard" 
            icon={HiChartPie}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <span className="font-medium">Dashboard</span>
          </SidebarItem>
          
          <SidebarItem 
            href="cars" 
            icon={HiViewBoards}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <span className="font-medium">Cars</span>
          </SidebarItem>
          
          <SidebarItem 
            href="employees" 
            icon={HiInbox}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <span className="font-medium">Employee Accounts</span>
          </SidebarItem>
          
          <SidebarItem 
            href="clients" 
            icon={HiUser}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <span className="font-medium">Client Accounts</span>
          </SidebarItem>
          
          <SidebarItem 
            href="expenses" 
            icon={HiShoppingBag}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <span className="font-medium">General Expense</span>
          </SidebarItem>
        </SidebarItemGroup>

        {/* Bottom Section */}
        <SidebarItemGroup className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
          <SidebarItem 
            href="settings" 
            icon={HiTable}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <span className="font-medium">Settings</span>
          </SidebarItem>
          
          <SidebarItem 
            href="sign-in" 
            icon={HiArrowSmRight}
            className="hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 text-red-600 dark:text-red-400"
          >
            <span className="font-medium">Sign Out</span>
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
