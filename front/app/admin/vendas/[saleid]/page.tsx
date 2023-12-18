import EditSaleForm from "./form";

export default function EditSale() {
  return (
    <div className='wk-admin-page-wrapper'>
      <div className='container'>
        <div className='list-clients-header'>
          <h1 className='text-5xl font-bold'>Editar Venda</h1>
        </div>
        <EditSaleForm />
      </div>
    </div>
  );
}
