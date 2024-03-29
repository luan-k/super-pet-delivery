"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/static/images/superpet-logo.png";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { FaWhatsapp } from "react-icons/fa";
import { RiMapPin2Fill } from "react-icons/ri";

export default function Header() {
  const [currentRoute, setCurrentRoute] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuItem2, setIsMenuItem2] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Update the current route when the route changes
    setCurrentRoute(pathname);
  }, [pathname]);

  const isActive = (href: string) => {
    // Compare the current route with the link's href
    return currentRoute === href ? "wk-header__nav-item--active" : "";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleMenuItem2 = () => {
    setIsMenuItem2(!isMenuItem2);
  };

  return (
    <>
      <header
        className={`wk-header ${
          pathname === "/login" || pathname.startsWith("/admin") ? "hidden" : ""
        }`}>
        <div className='wk-header__socials-nav'>
          <a href='https://www.instagram.com/superpetdelivery/' target='_blank'>
            <InstagramLogoIcon />
            @superpetdelivery
          </a>
          <a
            href='https://api.whatsapp.com/send?phone=554899805164&text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20produtos%20da%20SuperPet.'
            target='_blank'>
            <FaWhatsapp />
            (48) 9980-5164
          </a>
          <a href='https://maps.app.goo.gl/QvXd9NArgN2aUMoC7' target='_blank'>
            <RiMapPin2Fill />
            Manoel Gualberto dos Santos 109
          </a>
        </div>
        <div className='wk-header__wrapper container'>
          <Link href='/'>
            <Image
              className='wk-header__image'
              src={Logo}
              alt='Logo'
              width={90}
              height={90}
            />
          </Link>

          <button
            className={`wk-hamburger ${isMenuOpen ? "open" : ""}`}
            onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav
            className={`wk-header__nav ${
              isMenuOpen ? "wk-header__nav--active" : ""
            }`}>
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
    </>
  );
}
