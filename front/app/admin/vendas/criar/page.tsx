import CreateSale from "./form";

export default function CriarSale() {
  return (
    <div className='wk-admin-page-wrapper'>
      <div className='container'>
        <div className='list-clients-header'>
          <h1 className='text-5xl font-bold'>Criar Nova Venda</h1>
        </div>
        <CreateSale />
      </div>
    </div>
  );
  return;
}
