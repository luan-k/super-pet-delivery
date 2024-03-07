import Link from "next/link";
import HistoryArrows from "../components/HistoryArrows";
import ImageIcon from "../../../public/admin-image.svg";
import ImageList from "./ImageList";

export default function Galeria() {
  return (
    <>
      <div className='list-clients-header wk-admin-page-wrapper w-full my-7 font-Inter container'>
        <div className='arrows-wrapper w-fit gap-2'>
          <HistoryArrows />
        </div>
        <div className='title-wrapper grid grid-cols-2 mt-7'>
          <h1 className='text-5xl font-semibold '>Galeria</h1>
          <div className='wk-btn__wrapper ml-auto gap-6 '>
            <button className='wk-btn wk-btn--secondary wk-btn--sm'>
              <ImageIcon />
              Adicionar Imagens
            </button>
          </div>
        </div>
      </div>

      <ImageList />
    </>
  );
}
