import { FaPaw } from "react-icons/fa6";
import Image from "next/image";
import GranPlus from "../../public/static/images/GranPlus.png";
import Catfit from "../../public/static/images/Catfit.png";
import Monello from "../../public/static/images/Monello.png";
import PremieR from "../../public/static/images/PremieR.png";
import Purina from "../../public/static/images/Purina.png";
import GoldeN from "../../public/static/images/GoldeN.webp";

export default function Brands() {
  return (
    <div className='wk-brands bg-front-blue'>
      <div className='container py-40'>
        <div className='text-6xl text-white text-center flex justify-center gap-7 mb-24'>
          <FaPaw /> Qualidade para o seu pet!
        </div>
        <div className='grid grid-cols-1 md:grid-cols-6 relative h-full gap-5 mt-20 w-full'>
          <div className='image-wrapper'>
            <Image draggable={false} src={GranPlus} alt='Gran Plus' />
          </div>
          <div className='image-wrapper'>
            <Image draggable={false} src={Catfit} alt='Catfit' />
          </div>
          <div className='image-wrapper'>
            <Image draggable={false} src={GoldeN} alt='Golden Premium' />
          </div>
          <div className='image-wrapper'>
            <Image draggable={false} src={PremieR} alt='Premier pet' />
          </div>
          <div className='image-wrapper'>
            <Image draggable={false} src={Monello} alt='Monello' />
          </div>
          <div className='image-wrapper'>
            <Image draggable={false} src={Purina} alt='Purina pro plan' />
          </div>
        </div>
      </div>
    </div>
  );
}
