import Image from "next/image";
import LogoImage from "../public/static/images/superpet.png";
import WhatsappImagePath from "../public/static/images/whatsapp-logo.png";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import "./styles/main.scss";

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24'>
      <div className='z-10 max-w-5xl w-full items-center justify-center  text-sm lg:flex'>
        <div className='flex flex-col items-center'>
          <Image src={LogoImage} alt='Logo' width={300} height={300} />
          <div className='flex justify-center flex-row text-3xl gap-12 mt-14'>
            {/*  <a
              className='flex items-center gap-4'
              target='_blank'
              href='tel:1234567890'>
              <FaPhoneAlt className='inline' />
              <span>123-456-7890</span>
            </a> */}
            <a
              className='flex items-center gap-4'
              target='_blank'
              href='https://wa.me/+554899805164'>
              <FaWhatsapp className='inline' />
              <span>+55 48 9980-5164</span>
            </a>
          </div>
          <h1 className='text-5xl font-bold mt-12'>Em breve um novo site!</h1>
        </div>
      </div>
      <a
        className='frontpage-whatsapp-button'
        target='_blank'
        href='https://wa.me/+554899805164'>
        <Image src={WhatsappImagePath} alt='Logo' width={60} height={60} />
      </a>
    </main>
  );
}
