
"use client";
import { Component as UserCard } from "../Pages/userPages/userCard";
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards, HiTag, HiCollection, HiDocumentText, HiCash, HiCurrencyDollar } from "react-icons/hi";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Component({ onNavigate }: SidebarProps = {}) {
  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <Sidebar 
      aria-label="Main navigation sidebar" 
      className="h-full shadow-lg border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
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
            onClick={handleNavClick}
          >
            <span className="font-medium">Dashboard</span>
          </SidebarItem>
          
          <SidebarItem 
            href="cars" 
            icon={HiViewBoards}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">Cars</span>
          </SidebarItem>
          
          <SidebarItem 
            href="invoices" 
            icon={HiDocumentText}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">Invoices</span>
          </SidebarItem>
          
          <SidebarItem 
            href="payments" 
            icon={HiCash}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">Payments</span>
          </SidebarItem>
          
          <SidebarItem 
            href="account-withdrawals" 
            icon={HiCurrencyDollar}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">Account Withdrawals</span>
          </SidebarItem>
          
          <SidebarItem 
            href="car-expenses" 
            icon={HiShoppingBag}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">Car Expenses</span>
          </SidebarItem>
          
          <SidebarItem 
            href="make" 
            icon={HiTag}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">Car Makes</span>
          </SidebarItem>
          
          <SidebarItem 
            href="car-models" 
            icon={HiCollection}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">Car Models</span>
          </SidebarItem>
          
          <SidebarItem 
            href="accounts" 
            icon={HiInbox}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">Employee Accounts</span>
          </SidebarItem>
          
          <SidebarItem 
            href="clients" 
            icon={HiUser}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">Client Accounts</span>
          </SidebarItem>
          
          <SidebarItem 
            href="expenses" 
            icon={HiShoppingBag}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
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
            onClick={handleNavClick}
          >
            <span className="font-medium">Settings</span>
          </SidebarItem>
          
          <SidebarItem 
            href="sign-in" 
            icon={HiArrowSmRight}
            className="hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 text-red-600 dark:text-red-400"
            onClick={handleNavClick}
          >
            <span className="font-medium">Sign Out</span>
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
