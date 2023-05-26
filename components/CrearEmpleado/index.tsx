import React, { useState } from 'react';
import axios from 'axios'
function EmpleadosForm() {
  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('');
  const [pagoJornada, setPagoJornada] = useState(0);
  const [sueldoMensual, setsueldoMensual] = useState(0);
  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault()
  
    let data = {
      nombre:nombre,
      cargo:cargo,
      pagoJornal:Number(pagoJornada),
      salario:Number(sueldoMensual)
    }
    console.log(data)
  const response = await axios.post(`${process.env.IP}/api/v1/empleado`,data)
console.log(response)
  };
  return (
    
        <form>
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label text-dark">
          Nombre:
        </label>
        <input type="text" className="form-control  p-2" id="nombre" value={nombre} onChange={(event) => setNombre(event.target.value)} required />
      </div>
      <div className="mb-3">
        <label htmlFor="cargo" className="form-label text-dark">
          Cargo:
        </label>
        <input type="text" className="form-control  p-2" id="cargo" value={cargo} onChange={(event) => setCargo(event.target.value)} required />
      </div>
      <label className="form-label text-dark ">
          Pago por jornal: 
        </label>
      <div className="mb-4 input-group">
        <span className="input-group-text ">$</span>
        <input type="number" className="form-control w-25" id="pagoJornada" value={pagoJornada} onChange={(event) => setPagoJornada(parseInt(event.target.value))} required/>

      </div>
      <label className="form-label text-dark ">
          Sueldo Semanal: 
        </label>
      <div className="mb-4 input-group">
        <span className="input-group-text ">$</span>
        <input type="number" className="form-control w-25" id="sueldoMensual" value={sueldoMensual} onChange={(event) => setsueldoMensual(parseInt(event.target.value))} required/>

      </div>
      <div className='text-center'>
      <button type="submit" className="btn btn-success "  onClick={handleSubmit}>
       Agregar
      </button>
      </div>
    </form>
    
  );
}

export default EmpleadosForm;
