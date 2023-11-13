"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import "../styles/admin/sidebar.scss";

export default function AdminSidebar() {
  const router = useRouter();
  const [currentRoute, setCurrentRoute] = useState("");
  const pathname = usePathname();
  console.log(pathname);

  useEffect(() => {
    // Update the current route when the route changes
    setCurrentRoute(pathname);
  }, [pathname]);
  console.log(currentRoute);

  const isActive = (href: string) => {
    // Compare the current route with the link's href
    return currentRoute === href ? "bg-blue-950" : "";
  };

  return (
    <div className='h-full w-1/12 wkode-admin-sidebar '>
      <Link className={isActive("/admin/clientes")} href={"/admin/clientes"}>
        Clientes
      </Link>
      {/* Add more links as needed */}
    </div>
  );
}
