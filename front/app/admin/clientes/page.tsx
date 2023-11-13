import Link from "next/link";
import ListClients from "./ListClients";

export default function Clientes() {
  return (
    <>
      <Link
        className='bg-sky-700 text-white px-4 py-3'
        href={"/admin/clientes/criar"}>
        Novo Cliente
      </Link>
      <ListClients />
      this is clients
    </>
  );
}
