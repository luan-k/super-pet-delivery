import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import "../../styles/components/main.scss";
import ListClients from "../clientes/ListClients";

interface ModalDialogClientsListProps {
  onClientSelect?: (clientId: number, clientName: string) => void;
}

const ModalDialogClientsList: React.FC<ModalDialogClientsListProps> = ({
  onClientSelect,
}) => {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className='wk-btn wk-btn--md wk-btn--yellow !w-3/12 mt-4 !rounded-tl-none !rounded-bl-none'>
          Selecionar Cliente
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='DialogOverlay' />
        <Dialog.Content className='DialogContent'>
          <Dialog.Title className='DialogTitle'>
            Selecionar Cliente
          </Dialog.Title>
          <ListClients
            className='w-full'
            onClientSelect={(clientId, clientName) => {
              onClientSelect?.(clientId, clientName);
              closeRef.current?.click();
            }}
            isInModal={true}
          />
          <div
            style={{
              display: "flex",
              marginTop: 25,
              justifyContent: "flex-end",
            }}>
            <Dialog.Close asChild>
              <button className='Button green'>Save changes</button>
            </Dialog.Close>
          </div>
          <Dialog.Close ref={closeRef} asChild>
            <button className='IconButton' aria-label='Close'>
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ModalDialogClientsList;
