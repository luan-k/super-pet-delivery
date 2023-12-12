import Link from "next/link";
import ListClients from "./ListClients";

export default function Clientes() {
  return (
    <>
      <div className='list-clients-header wk-admin-page-wrapper'>
        <h1 className='text-5xl font-bold'>Clientes</h1>
        <div className='wk-btn__wrapper ml-auto'>
          <Link
            className='wk-btn wk-btn--blue wk-btn--bg text-2xl'
            href={"/admin/clientes/criar"}>
            Novo Cliente
          </Link>
        </div>
      </div>
      <ListClients className='w-11/12' />
    </>
  );
}
