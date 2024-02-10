import CreateClient from "./form";

export default function CriarCliente() {
  return (
    <div className='wk-admin-page-wrapper'>
      <div className='container'>
        <div className='list-clients-header'>
          <h1 className='text-5xl font-bold'>Criar Novo Cliente</h1>
        </div>
        <CreateClient />
      </div>
    </div>
  );
}
