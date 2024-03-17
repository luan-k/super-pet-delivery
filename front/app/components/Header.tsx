"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/static/images/superpet-logo.png";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const [currentRoute, setCurrentRoute] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    // Update the current route when the route changes
    setCurrentRoute(pathname);
  }, [pathname]);

  const isActive = (href: string) => {
    // Compare the current route with the link's href
    return currentRoute.includes(href) ? "wk-header__nav-item--active" : "";
  };

  return (
    <header className='wk-header'>
      <div className='wk-header__wrapper container'>
        <Link href='/'>
          <Image src={Logo} alt='Logo' width={90} height={90} />
        </Link>
        <nav className='wk-header__nav'>
          <ul className='wk-header__nav-list'>
            <li className={`wk-header__nav-item ${isActive("/")}`}>
              <Link href='/'>Início</Link>
            </li>
            <li className={`wk-header__nav-item ${isActive("/produtos")}`}>
              <Link href='/produtos'>Produtos</Link>
            </li>
            <li className={`wk-header__nav-item ${isActive("/quem-somos")}`}>
              <Link href='/quem-somos'>Quem Somos</Link>
            </li>
            <li className={`wk-header__nav-item ${isActive("/contato")}`}>
              <Link href='/contato'>Contato</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
