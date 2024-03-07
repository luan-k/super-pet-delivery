import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import React from "react";
import { Image } from "./ImageList";
import Link from "next/link";
import SaveIcon from "../../../public/admin-save.svg";

interface SingleImageListProps {
  image: Image;
}

export default function SingleImageList({ image }: SingleImageListProps) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const [altText, setAltText] = React.useState(image.alt);
  const [title, setTitle] = React.useState(image.name);
  const [description, setDescription] = React.useState(image.description);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div key={image.id} className='wk-image-list__item'>
          <img
            src={`${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080${image.image_path}`}
            alt={image.alt}
            width={300}
            height={300}
            className='wk-image-list__image'
          />
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={`wk-image-list__overlay `} />
        <Dialog.Content className={`wk-image-list__content `}>
          <Dialog.Title className='wk-image-list__title'>
            Detalhes do arquivo
          </Dialog.Title>

          <div className='grid grid-cols-3 gap-8'>
            <div>
              <img
                src={`${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080${image.image_path}`}
                alt={image.alt}
                width={300}
                height={300}
                className='wk-image-list__image'
              />
            </div>
            <div className='col-span-2'>
              <form className='wk-form flex gap-7 flex-col'>
                <label>
                  <h4>Texto Alternativo</h4>
                  <input
                    type='text'
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                  />
                </label>
                <label>
                  <h4>Título</h4>
                  <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>
                <label>
                  <h4>Descrição</h4>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>
                <div className='flex text-lg gap-4'>
                  <a
                    href={`${process.env.NEXT_PUBLIC_SUPERPET_DELIVERY_URL}:8080${image.image_path}`}
                    download>
                    Baixar arquivo
                  </a>
                  <span className='opacity-50'>|</span>
                  <Dialog.Close ref={closeRef} asChild>
                    <a href='#' className='text-red-500'>
                      Excluir permanentemente
                    </a>
                  </Dialog.Close>
                </div>
                <div className='wk-form__footer'>
                  <Dialog.Close ref={closeRef} asChild>
                    <button className='wk-btn wk-btn--md wk-btn--default'>
                      Cancelar
                    </button>
                  </Dialog.Close>

                  <button
                    className='wk-btn wk-btn--md wk-btn--primary'
                    type='submit'>
                    <SaveIcon className='wk-icon' />
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>

          <Dialog.Close ref={closeRef} asChild>
            <button className='wk-image-list__btn' aria-label='Close'>
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
