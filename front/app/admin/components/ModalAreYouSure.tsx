import React, { FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import "../../styles/components/main.scss";
import DeleteIcon from "../../../public/admin-delete.svg";

interface deleteProps {
  deleteFunction: (id: number) => void;
  deleteIndex: number;
}

export default function ModalAreYouSure({
  deleteFunction,
  deleteIndex,
}: deleteProps) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>
          <DeleteIcon />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='ModalAreYouSure__overlay' />
        <Dialog.Content className='ModalAreYouSure__content'>
          <Dialog.Title className='ModalAreYouSure__title'>
            Tem certeza que deseja deletar?
          </Dialog.Title>
          <Dialog.Close ref={closeRef} asChild>
            <div className='flex justify-evenly'>
              <button
                className=' px-10 py-6 font-semibold bg-red-500 rounded-md text-white flex items-center text-2xl gap-5 duration-300 transition-all hover:bg-red-600'
                onClick={(e) => {
                  console.log("deleteIndex: ", deleteIndex);
                  deleteFunction(deleteIndex);
                }}>
                <DeleteIcon className='fill-white [&_*]:fill-white' />
                Deletar
              </button>
              <button className='wk-btn wk-btn--blue wk-btn--bg text-2xl'>
                Cancelar
              </button>
            </div>
          </Dialog.Close>

          <Dialog.Close ref={closeRef} asChild>
            <button className='ModalAreYouSure__btn' aria-label='Close'>
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
