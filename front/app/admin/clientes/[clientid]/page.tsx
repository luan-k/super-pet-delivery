import EditClientForm from "./form";

export default function EditClient() {
  return (
    <div className='wk-admin-page-wrapper'>
      <div className='container'>
        <div className='list-clients-header'>
          <h1 className='text-5xl font-bold'>Editar Cliente</h1>
        </div>
        <EditClientForm />
      </div>
    </div>
  );
}
