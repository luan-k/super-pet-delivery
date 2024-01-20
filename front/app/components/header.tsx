"use client";
import Link from "next/link";
import Image from "next/image";
import LogoImage from "../../public/static/images/superpet.png";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
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
    return currentRoute === href ? "wk-header__menu__item--active" : "";
  };
  return (
    <header className='wk-header'>
      <div className='wk-header__wrapper container'>
        <div className='wk-header__logo'>
          <Link href='/'>
            <Image src={LogoImage} alt='Logo' width={100} height={100} />
          </Link>
        </div>
        <div className='wk-header__menu'>
          <Link className={`wk-header__menu__item ${isActive("/")}`} href='/'>
            Inicio
          </Link>
          <Link
            className={`wk-header__menu__item ${isActive("/produtos")}`}
            href='/produtos'>
            Produtos
          </Link>
          <Link
            className={`wk-header__menu__item ${isActive("/quem-somos")}`}
            href='/quem-somos'>
            Quem Somos
          </Link>
          <Link
            className={`wk-header__menu__item ${isActive("/contato")}`}
            href='/contato'>
            Contato
          </Link>
        </div>
      </div>
    </header>
  );
}
