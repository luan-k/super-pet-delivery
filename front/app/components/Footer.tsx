"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/static/images/superpet-logo.png";
import FooterAnimals from "../../public/static/images/animaisfootermini.png";
import WhatsappImage from "../../public/static/images/whatsapp-logo-border.png";
import WKode from "../../public/wkode-footer-logo.svg";
import { FaWhatsapp, FaInstagram, FaMapMarker } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NumberFormat from "react-number-format";

export default function Footer() {
  const [currentRoute, setCurrentRoute] = useState("");
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await fetch("http://localhost:8080/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, phone, message }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      console.log("Form submitted successfully");
      setFormSubmitted(true);
    } else {
      console.error("Form submission failed");
    }
  };

  useEffect(() => {
    // Update the current route when the route changes
    setCurrentRoute(pathname);
  }, [pathname]);

  return (
    <footer
      className={`wk-footer ${
        pathname === "/login" || pathname.startsWith("/admin") ? "hidden" : ""
      }`}>
      <Image src={FooterAnimals} alt='' className='wk-footer-image' />
      <div className='container grid grid-cols-1 lg:grid-cols-4 p-20'>
        <div className='wk-footer-section'>
          <Image draggable={false} src={Logo} alt='Superpet' />
          <div className='wk-footer-text'>
            Sabemos que os animais de estimação são como uma família, por isso
            estamos comprometidos em fornecer produtos da mais alta qualidade em
            que você pode confiar.
          </div>
          <div className='wk-footer-icons'>
            <Link href='https://www.google.com/maps/place/Super+Pet+Delivery/@-27.6316157,-48.6558265,15z/data=!4m6!3m5!1s0x95273597c288c591:0x428507ff8e06abda!8m2!3d-27.6316157!4d-48.6558265!16s%2Fg%2F11tx4q5rtv?entry=ttu'>
              <FaMapMarker />
            </Link>
            <Link href='https://api.whatsapp.com/send?phone=554899805164&text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20produtos%20da%20SuperPet.'>
              <FaWhatsapp />
            </Link>
            <Link href='https://www.instagram.com/superpetdelivery/'>
              <FaInstagram />
            </Link>
          </div>
        </div>
        <div className='wk-footer-section'>
          <h3>Institucional</h3>
          <Link href='/'>Início</Link>
          <Link href='/produtos'>Produtos</Link>
          <Link href='/sobre-nos'>Sobre nós</Link>
          <Link href='/contato'>Contato</Link>
        </div>
        <div className='wk-footer-section'>
          <h3>Categorias</h3>
          <Link href='/produtos?category=Cachorros'>Cachorros</Link>
          <Link href='/produtos?category=Gatos'>Gatos</Link>
          <Link href='/produtos?category=Medicamentos'>Medicamentos</Link>
          <Link href='/produtos?category=Acessórios-e-Brinquedos'>
            Acessórios e Brinquedos
          </Link>
          <Link href='/produtos?category=Promoções'>Promoções</Link>
        </div>
        <div className='wk-footer-section'>
          <h3>Fale Conosco</h3>
          <div className='wk-form'>
            {formSubmitted ? (
              <p>Obrigado pela mensagem, entraremos em contato em breve.</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <label>
                  <h4>Nome</h4>
                  <input
                    type='text'
                    name='name'
                    required
                    placeholder='Seu nome'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label>
                  <h4>Email</h4>
                  <input
                    type='email'
                    name='email'
                    required
                    placeholder='Seu email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label>
                  <h4>Telefone</h4>
                  <NumberFormat
                    format='(##) # ####-####'
                    isNumericString={true}
                    value={phone}
                    onValueChange={(values) => setPhone(values.value)}
                    placeholder='Ex: (00) 9 9999-9999'
                  />
                </label>
                <label>
                  <h4>Mensagem</h4>
                  <textarea
                    name='message'
                    cols={30}
                    rows={10}
                    placeholder='Sua mensagem'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}></textarea>
                </label>
                <button
                  className='wk-btn wk-btn--sm wk-btn--primary'
                  type='submit'
                  disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <div className='wk-footer-main container p-20 flex items-center justify-end'>
        <WKode />
      </div>
      <Link
        target='_blanket'
        href='https://api.whatsapp.com/send?phone=554899805164&text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20produtos%20da%20SuperPet.'>
        <Image
          src={WhatsappImage}
          alt='Imagem whatsapp'
          className='wk-whatsapp-image'
          width={70}
          height={70}
        />
      </Link>
    </footer>
  );
}
