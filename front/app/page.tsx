import Image from "next/image";
import LogoImage from "../public/static/images/superpet.png";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
        <div className='flex flex-col items-center'>
          <Image
            src={LogoImage} // replace with your logo path
            alt='Logo'
            width={100}
            height={100}
          />
          <div className='flex justify-center gap-4 mt-4'>
            <a href='tel:1234567890'>
              <FaPhoneAlt />

              <span>123-456-7890</span>
            </a>
            <a href='https://wa.me/1234567890'>
              <FaWhatsapp />

              <span>123-456-7890</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
