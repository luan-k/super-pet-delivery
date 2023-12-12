import Link from "next/link";
import ListSales from "./ListSales";

export default function Vendas() {
  return (
    <>
      <div className='list-clients-header wk-admin-page-wrapper'>
        <h1 className='text-5xl font-bold'>Vendas</h1>
        <div className='wk-btn__wrapper ml-auto'>
          <Link
            className='wk-btn wk-btn--blue wk-btn--bg text-2xl'
            href={"/admin/vendas/criar"}>
            Nova Venda
          </Link>
        </div>
      </div>
      <ListSales className='w-11/12' />
    </>
  );
}
