"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/static/images/superpet-logo.png";
import FooterAnimals from "../../public/static/images/animaisfootermini.png";
import WKode from "../../public/wkode-footer-logo.svg";
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Footer() {

    const [currentRoute, setCurrentRoute] = useState("");
    const pathname = usePathname();

    useEffect(() => {
        // Update the current route when the route changes
        setCurrentRoute(pathname);
      }, [pathname]);
 
    return(
        <footer className={`wk-footer ${
        pathname === "/login" || pathname.startsWith("/admin") ? "hidden" : ""
        }`}>
            <Image src={FooterAnimals} alt="" className="wk-footer-image" />
            <div className="container grid grid-cols-1 lg:grid-cols-4 p-20">
                <div className="wk-footer-section">
                    <Image draggable={false} src={Logo} alt="Superpet" />
                    <div className="wk-footer-text">
                        Sabemos que os animais de estimação são como uma família, por isso estamos comprometidos em fornecer produtos da mais alta qualidade em que você pode confiar.
                    </div>
                    <div className="wk-footer-icons">
                        <Link href="#">
                            <FaYoutube />
                        </Link>
                        <Link href="#">
                            <FaFacebook />
                        </Link>
                        <Link href="#">
                            <FaInstagram />
                        </Link>
                    </div>
                </div>
                <div className="wk-footer-section">
                    <h3>Institucional</h3>
                    <Link href='/'>Início</Link>
                    <Link href='/produtos'>Produtos</Link>
                    <Link href='/sobre-nos'>Sobre nós</Link>
                    <Link href='/contato'>Contato</Link>
                    <Link href='#'>Pesquisar</Link>
                </div>
                <div className="wk-footer-section">
                    <h3>Categorias</h3>
                    <Link href='#'>Cachorros</Link>
                    <Link href='#'>Gatos</Link>
                    <Link href='#'>Medicamentos</Link>
                    <Link href='#'>Acessorios</Link>
                    <Link href='#'>Ofertas</Link>
                </div>
                <div className="wk-footer-section">
                    <h3>Fale Conosco</h3>
                    <div className="wk-form">
                        <label>
                            <h4>Nome</h4>
                            <input type="text" name="name" required placeholder='Seu nome' />
                        </label>
                        <label>
                            <h4>Email</h4>
                            <input type="email" name="email" required placeholder='Seu email' />
                        </label>
                        <label>
                            <h4>Telefone</h4>
                            <input type="phone" name="phone" required placeholder='Seu telefone' />
                        </label>
                        <label>
                            <h4>Mensagem</h4>
                            <textarea name="message" cols={30} rows={10} placeholder='Sua mensagem' ></textarea>
                        </label>
                        <button className='wk-btn wk-btn--sm wk-btn--primary' type='submit'>Enviar</button>
                    </div>
                </div>
            </div>
            <div className="wk-footer-main container p-20 flex items-center justify-end">
                <WKode />
            </div>
        </footer>
    )
}