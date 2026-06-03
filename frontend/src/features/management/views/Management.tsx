export const Management = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      <div className="flex gap-4 mb-6">
        <button className="px-4 py-2 bg-primary-600 text-white rounded">Profesionales</button>
        <button className="px-4 py-2 bg-slate-200 rounded">Coberturas</button>
      </div>
      
      {/* <DataTable entity="professionals" />  */}
    </div>
  );
};