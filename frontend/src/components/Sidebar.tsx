
"use client";
import { Component as UserCard } from "../Pages/userPages/userCard";
import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";

export function Component() {
  return (
    <Sidebar aria-label="Default sidebar example">
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="#">
            <div className="flex justify-center">
              <UserCard />
            </div>
            </SidebarItem>
        </SidebarItemGroup>
        <SidebarItemGroup>
          <SidebarItem href="dashboard" icon={HiChartPie}>
            Dashboard
          </SidebarItem>
          <SidebarItem href="cars" icon={HiViewBoards}>
            Cars
          </SidebarItem>
          <SidebarItem href="employees" icon={HiInbox}>
            Employee Accounts
          </SidebarItem>
          <SidebarItem href="clients" icon={HiUser}>
            Client Accounts
          </SidebarItem>
          <SidebarItem href="expenses" icon={HiShoppingBag}>
            General Expense
          </SidebarItem>
          <SidebarItem href="sign-in" icon={HiArrowSmRight}>
            Sign In
          </SidebarItem>
          <SidebarItem href="settings" icon={HiTable}>
            Settings
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
