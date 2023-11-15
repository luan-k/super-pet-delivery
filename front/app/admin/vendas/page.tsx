import Link from "next/link";
import ListSales from "./ListSales";

export default function Vendas() {
  return (
    <>
      <Link
        className='bg-sky-700 text-white px-4 py-3'
        href={"/admin/vendas/criar"}>
        Novo Venda
      </Link>
      <ListSales />
      this is clients
    </>
  );
}
