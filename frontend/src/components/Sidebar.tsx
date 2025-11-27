
"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Component as UserCard } from "../Pages/userPages/userCard";
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { HiChartPie, HiInbox, HiShoppingBag, HiUser, HiViewBoards, HiTag, HiCollection, HiDocumentText, HiCash, HiCurrencyDollar, HiUsers, HiCog } from "react-icons/hi";
import { SettingsModal } from "./SettingsModal";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Component({ onNavigate }: SidebarProps = {}) {
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSettingsOpen(true);
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
            href="/dashboard" 
            icon={HiChartPie}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">{t('sidebar.dashboard')}</span>
          </SidebarItem>
          
          <SidebarItem 
            href="/cars" 
            icon={HiViewBoards}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">{t('sidebar.cars')}</span>
          </SidebarItem>
          
          <SidebarItem 
            href="/invoices" 
            icon={HiDocumentText}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">{t('sidebar.invoices')}</span>
          </SidebarItem>
          
          <SidebarItem 
            href="/payments" 
            icon={HiCash}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">{t('sidebar.payments')}</span>
          </SidebarItem>
          
          <SidebarItem 
            href="/account-withdrawals" 
            icon={HiCurrencyDollar}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">{t('sidebar.accountWithdrawals')}</span>
          </SidebarItem>
          
          <SidebarItem 
            href="/car-expenses" 
            icon={HiShoppingBag}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">{t('sidebar.carExpenses')}</span>
          </SidebarItem>
          
          <SidebarItem 
            href="/make" 
            icon={HiTag}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">{t('sidebar.carMakes')}</span>
          </SidebarItem>
          
          <SidebarItem 
            href="/car-models" 
            icon={HiCollection}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">{t('sidebar.carModels')}</span>
          </SidebarItem>
          
          <SidebarItem 
            href="/accounts" 
            icon={HiInbox}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">{t('sidebar.accounts')}</span>
          </SidebarItem>
          
          <SidebarItem 
            href="/clients" 
            icon={HiUser}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">{t('sidebar.clients')}</span>
          </SidebarItem>
          
          <SidebarItem 
            href="/users" 
            icon={HiUsers}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">{t('sidebar.users')}</span>
          </SidebarItem>
          
          <SidebarItem 
            href="/expenses" 
            icon={HiShoppingBag}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleNavClick}
          >
            <span className="font-medium">{t('sidebar.expenses')}</span>
          </SidebarItem>
        </SidebarItemGroup>

        {/* Bottom Section */}
        <SidebarItemGroup className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
          {/* Language Switcher */}
          <SidebarItem href="#" className="hover:bg-transparent cursor-default">
            <LanguageSwitcher />
          </SidebarItem>
          
          <SidebarItem 
            href="#" 
            icon={HiCog}
            className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={handleSettingsClick}
          >
            <span className="font-medium">{t('sidebar.settings')}</span>
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </Sidebar>
  );
}
