import React, { useState, useEffect, HTMLAttributes, DetailedHTMLProps } from 'react';
import { Table, Button, Form,Tab,Tabs,Modal, ModalProps } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import CrearPdf from '../CrearPdf'
import { Omit, BsPrefixProps } from 'react-bootstrap/esm/helpers';
import CrearEmpleado from '../CrearEmpleado'
import VerEmpleados from '../VerEmpleado'
import Obra from '../Obra'
import VerObras from '../Obra/VerObras'

function countUndefinedValues(obj: { [x: string]: any; }): number {
  let count = 0;
 Object.values(obj).map(d=>{
 Object.values(d).map(e => {
  if(e === undefined){
    count++;
  }
 })
 })


  return count;
}
const CreateEntregaForm = () => {
  const [nombre, setNombre] = useState('');

  const handleNombreChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNombre(event.target.value);
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://${process.env.IP}:5000/api/v1/entregaR`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setNombre('');
      alert('Entrega created successfully');
    } catch (error) {
      console.error(error);
      alert('Error creating entrega');
    }
  };
 
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="nombre">
        <Form.Label className='text-dark'>Nombre</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingresar nombre"
          value={nombre}
          onChange={handleNombreChange}
        />
      </Form.Group>
     <div className='text-center my-3'> <Button variant="success" type="submit">
        Agregar
      </Button></div>
    </Form>
  );
};

function MD(props: JSX.IntrinsicAttributes & Omit<Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & { ref?: ((instance: HTMLDivElement | null) => void) | RefObject<HTMLDivElement> | null | undefined; }, BsPrefixProps<"div"> & ModalProps> & BsPrefixProps<"div"> & ModalProps & { children?: ReactNode; }) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      
      className="text-white"
    >
      <Modal.Header closeButton className="bg-dark" closeVariant="white">
        <Modal.Title
          id="contained-modal-title-vcenter "
          className="text-white"
        >
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
    </Modal>
  );
}
const EntregaTable = () => {
  const [entregas, setEntregas] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://${process.env.IP}:5000/api/v1/entregaR`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEntregas(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nombre</th>
        </tr>
      </thead>
      <tbody>
        {entregas.map((entrega) => (
          <tr key={entrega._id}>
            <td>{entrega.nombre}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

function Tabla() {
  const [opciones, setOpciones] = useState([]);
  const [obras, setobras] = useState([]);

const [empleados, setempleados] = useState([{diasTrabajados:0}]);
  const [datosTabla, setDatosTabla] = useState([]);
  const [selectCount, setSelectCount] = useState(0);
  
  const getEmpleados = async () => {
    const res = await axios.get(
      `http://${process.env.IP}:5000/api/v1/empleado`
    );
    const data = await res.data;
    console.log(data);
    setempleados(data);
  };

  useEffect(() => {
    getEmpleados();
  }, []);

  const getObras = async () => {
    const response = await axios.get(
      `http://${process.env.IP}:5000/api/v1/obra`
    );
    const data = response.data.data;
    console.log(data);
    setobras(data)
    const opciones = data.map(obra => ({
      value: obra.obra,
      label: obra.obra,
    }));
    setOpciones(opciones);
  };

  useEffect(() => {
    getObras();
  }, []);
  const [payobras, setpayobras] = useState<number | undefined>();
  const [activemodalEmpleado, setactivemodalEmpleado] = useState(false);
  const [activeEntrega, setactiveEntrega] = useState(false);
  const [activeobra, setactiveobra] = useState(false);
  const [ob, setOb] = useState<Array<{obra: string, pago: number}>>([]);
  const handleChange = (e: { target: {}; }, id: any) => {
    const { name, value } = e.target || {};

    
    const nuevasFilas = empleados.map(empleado => {
      if (empleado._id === id) {
        const diasTrabajados = empleado.diasTrabajados || {};
        const diaSeleccionado = diasTrabajados[name] || {};
        console.log(diasTrabajados)
           var count = 0;
        var i;
        obras.forEach(obr => {
          if (obr.obra === value) {
           
            // Check if the `obra` already exists in the `ob` array
            const existingIndex = ob.findIndex(item => item.obra === value);
            if (existingIndex !== -1) {
              // If the `obra` already exists, update the `pago` value by adding the new `empleado.pagoJornal` value
              setOb(prevOb => {
                const newOb = [...prevOb];
                newOb[existingIndex].pago += empleado.pagoJornal;
                return newOb;
              });
            } else {
              // If the `obra` doesn't exist, add a new object to the `ob` array
              setOb(prevOb => [...prevOb, {obra: obr.obra, pago: empleado.pagoJornal}]);
            }
          }
        });
        let shouldBreak = false;
        const newDiasTrabajados = {
          ...diasTrabajados,
          [name]: value
        };
        let counter = countUndefinedValues(diasTrabajados) 
        
   if(counter <= 5 ){
    counter = counter +1 
   }
   console.log(counter)
        let numDias = (Object.keys(newDiasTrabajados).length -counter)
  
       
        document.getElementById(`numDias${id}`).value = numDias
        let jornval = Number(empleado.pagoJornal) * numDias
        document.getElementById(`pagoJornada${id}`).value = jornval
        return {

          ...empleado,
          pagoJornada: jornval,
          diasTrabajados: {
            ...diasTrabajados,
            [name]: {
              ...diaSeleccionado,
              [name]: value,
            },
           
          },
        
        };
      } else {
        return empleado;
      }
    });

    setempleados(nuevasFilas);
    
 
  };
  const handleDiasChange = (e: { target: { name: any; value: any; }; }, id: any) => {
    const { name, value } = e.target;
    const nuevasFilas = empleados.map(empleado => {
      if (empleado._id === id) {
        return {
          ...empleado,
          [name]: value,
        };
      } else {
        return empleado;
      }
    });
    setempleados(nuevasFilas);
  };

  const enviarDatos = (e: any) => {
    console.log(empleados)
    console.log(ob)
    
     
  
  };

  return (
    <>
   <Tabs
      defaultActiveKey="profile"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="Tabla" title="Tabla">
         <div>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cargo</th>
            <th>Salario</th>
            <th>Lunes</th>
            <th>Martes</th>
            <th>Miercoles</th>
            <th>Jueves</th>
            <th>Viernes</th>
            <th># de dias</th>
            <th>$ por jornada</th>
            <th>Pago de semana</th>
            
          </tr>
        </thead>
        <tbody>
          {empleados.map(empleados => (
            <tr key={empleados._id}>
              <td>
                <p>{empleados.nombre}</p>
              </td>
              <td>{empleados.cargo}</td>

              <td>${empleados.pagoJornal}</td>

              <td>
                <Select
                  options={opciones}
                  value={empleados.diasTrabajados?.lunes?.obra}
                  isClearable={true}
                  onChange={(opcion) =>
                    handleChange(
                      { target: { name: 'lunes', value: opcion?.value } },empleados._id
                      
                    )
                  }
                />
              </td>
              <td>
                <Select
                  options={opciones}
                  value={empleados.diasTrabajados?.lunes?.obra}
                  isClearable={true}
                  onChange={(opcion) =>
                    handleChange(
                      { target: { name: 'martes', value: opcion?.value } },empleados._id
                      
                    )
                  }
                />
              </td>
              <td>
                <Select
                  options={opciones}
                  value={empleados.diasTrabajados?.lunes?.obra}
                  isClearable={true}
                  onChange={(opcion) =>
                    handleChange(
                      { target: { name: 'miercoles', value: opcion?.value } },empleados._id
                      
                    )
                  }
                />
              </td>
              <td>
                <Select
                  options={opciones}
                  value={empleados.diasTrabajados?.lunes?.obra}
                  isClearable={true}
                  onChange={(opcion) =>
                    handleChange(
                      { target: { name: 'jueves', value: opcion?.value } },empleados._id
                      
                    )
                  }
                />
              </td>
              <td>
                <Select
                  options={opciones}
                  value={empleados.diasTrabajados?.lunes?.obra}
                  isClearable={true}
                  onChange={(opcion) =>
                    handleChange(
                      { target: { name: 'viernes', value: opcion?.value } },empleados._id
                      
                    )
                  }
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  id={`numDias${empleados._id}`}
                disabled
                />
              </td>
              <td>
              <div className="mb-4 input-group">
              <span className="input-group-text ">$</span>
                <Form.Control
                  type="number"
                  id={`pagoJornada${empleados._id}`}
                 disabled
                />
                </div>
              </td>

              <td>
              
                <p>${empleados.salario}</p>
              </td>

              
            </tr>
          ))}
        </tbody>
     
      </Table>
        <div className='text-center my-3'>

     
       </div>
    </div>
      </Tab>
      <Tab eventKey="Recibo" title="Recibo">
        <CrearPdf obra={ob}/>
      </Tab>
      <Tab eventKey="Agregar Base" title="Base" >
        <div className='text-center my-4'>
        <Button onClick={()  => setactiveEntrega(true)} className='mx-3'>Agregar Persona Entrega</Button>
        <Button onClick={()  => setactivemodalEmpleado(true)} className='mx-3'>Agregar Empleado</Button>
        <Button onClick={()  => setactiveobra(true)} className='mx-3'>Agregar Obra</Button>
        </div>
       
       <div className='my-4'>
       <EntregaTable/>
       </div>

        <div className='my-4'>

        <VerEmpleados/>
        </div>
        <div className={'my-4'}>
          <VerObras/>
        </div>
      </Tab>
    </Tabs>
    <MD
              show={activeEntrega}
              onHide={() => setactiveEntrega(false)}
              body={ <CreateEntregaForm/>}
              title="Agregar Persona Entrega"
            />
             <MD
              show={activemodalEmpleado}
              onHide={() => setactivemodalEmpleado(false)}
              body={ <CrearEmpleado/>}
              title="Agregar Empleado"
            />
              <MD
              show={activeobra}
              onHide={() => setactiveobra(false)}
              body={ <Obra/>}
              title="Agregar Obra"
            />
  </>
   
  );
}

export default Tabla;