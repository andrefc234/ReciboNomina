import React, {
  useState,
  useEffect,
  HTMLAttributes,
  DetailedHTMLProps,
  RefObject,
  ReactNode,
} from 'react';
import {
  Table,
  Button,
  Form,
  Tab,
  Tabs,
  Modal,
  ModalProps,
} from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import CrearPdf from '../CrearPdf';
import { Omit, BsPrefixProps } from 'react-bootstrap/esm/helpers';
import CrearEmpleado from '../CrearEmpleado';
import VerEmpleados from '../VerEmpleado';
import Obra from '../Obra';
import VerObras from '../Obra/VerObras';
import Calendar from '@/components/Calendar'
function countUndefinedValues(obj: { [x: string]: any }): number {
  let count = 0;
  Object.values(obj).map(d => {
    Object.values(d).map(e => {
      if (e === undefined || e === null) {
        count++;
      }
    });
  });

  return count;
}

const CreateEntregaForm = () => {
  const [nombre, setNombre] = useState('');

  const handleNombreChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setNombre(event.target.value);
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.IP}/api/v1/entregaR`, {
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
        <Form.Label className="text-dark">Nombre</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingresar nombre"
          value={nombre}
          onChange={handleNombreChange}
        />
      </Form.Group>
      <div className="text-center my-3">
        {' '}
        <Button variant="success" type="submit">
          Agregar
        </Button>
      </div>
    </Form>
  );
};

function MD(
  props: JSX.IntrinsicAttributes &
    Omit<
      Omit<
        DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
        'ref'
      > & {
        ref?:
          | ((instance: HTMLDivElement | null) => void)
          | RefObject<HTMLDivElement>
          | null
          | undefined;
      },
      BsPrefixProps<'div'> & ModalProps
    > &
    BsPrefixProps<'div'> &
    ModalProps & { children?: ReactNode }
) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="text-white"
    >
      <Modal.Header closeButton className="bg-dark" closeVariant="white">
        <Modal.Title id="contained-modal-title-vcenter " className="text-white">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
    </Modal>
  );
}
interface Empleado {
  _id: string;
  nombre: string;

}
const EntregaTable = () => {
  const [entregas, setEntregas] = useState<Empleado[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.IP}/api/v1/entregaR`);

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
        {entregas.map(entrega => (
          <tr key={entrega._id}>
            <td>{entrega.nombre}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

type DiasTrabajados = {
  obra: string;
  lunes: { obra: string };
  martes: { obra: string };
  miercoles: { obra: string };
  jueves: { obra: string };
  viernes: { obra: string };
};




interface Empleado {
  _id: string;
  __v:string;
  nombre: string;
  cargo: string;
  pagoJornal: number;
  salario: number;
  diasTrabajados: DiasTrabajados
  date?:Date;
}
interface Obras {
  obra: string;
}
function Tabla() {
  const [opciones, setOpciones] = useState([]);
  const [obras, setobras] = useState<Obras[]>([]);

  const [empleados, setempleados] = useState<Empleado[]>([]);
  const [datosTabla, setDatosTabla] = useState([]);
  const [selectCount, setSelectCount] = useState(0);

  const getEmpleados = async () => {
    const res = await axios.get(`${process.env.IP}/api/v1/empleado`);
    const data = await res.data;
    console.log(data);
    setempleados(data);
  };

  useEffect(() => {
    getEmpleados();
  }, []);

  const getObras = async () => {
    const response = await axios.get(`${process.env.IP}/api/v1/obra`);
    const data = response.data.data;
    console.log(data);
    setobras(data);
    const opciones = data.map((obra: { obra: any }) => ({
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
  const [ob, setOb] = useState<Array<{ obra: string; pago: number }>>([]);
  const handleChange = (e: { target: any; }, id: string,isClearable:boolean) => {
    const { name, value } = e.target;
  
    // Update the `empleados` state variable
    setempleados(prevEmpleados => {
      return prevEmpleados.map(empleado => {
        if (empleado._id === id) {
          const diasTrabajados: DiasTrabajados = empleado.diasTrabajados || {};
          const diaSeleccionado: DiasTrabajados[keyof DiasTrabajados] = diasTrabajados[name as keyof DiasTrabajados];
          const diaSeleccionadoObra = diaSeleccionado as { obra: string; };
  
        
          let newDiasTrabajados: DiasTrabajados = {
            ...diasTrabajados,
            [name]: isClearable && value === null ? undefined : value,
          };
          
          // Check if the select was cleared
          if (isClearable && value === null) {
            delete newDiasTrabajados[name as keyof DiasTrabajados]  // remove the property if it exists
            
            // Subtract the value from the corresponding `ob` object
            setOb(prevOb => {
              const obraIndex = prevOb.findIndex(ob => ob.obra === diaSeleccionadoObra.obra);

              if (obraIndex !== -1) {
                const newOb = [...prevOb];
                newOb[obraIndex] = {
                  ...newOb[obraIndex],
                  pago: newOb[obraIndex].pago - Number(empleado.pagoJornal),
                };
                return newOb;
              } else {
                return prevOb;
              }
            })
          }


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
                setOb(prevOb => [
                  ...prevOb,
                  { obra: obr.obra, pago: empleado.pagoJornal },
                ]);
              }
            }
          });
     
  
          let counter = countUndefinedValues(diasTrabajados);
          console.log(counter + "counter")
          let numDias;
          if(counter === 5){
             numDias = 1
          }else if(counter === 4 && numDias === 2){
          numDias = 0
          }else if(counter === 3 && numDias === 3 ){
            numDias = 1
          }else if(counter === 2 && numDias === 4){
            numDias = 2
          }else if(counter === 1 && numDias === 5){
            numDias = 3
          }else if(counter === 4 && numDias === 1){
            numDias = 2
          }else {
            numDias = Object.keys(newDiasTrabajados).length - counter;
          }
         console.log(numDias)
          const element = document.getElementById(`numDias${id}`) as HTMLInputElement;
          if (element !== null) {
            element.value = numDias.toString();
          }
          let jornval = Number(empleado.pagoJornal) * numDias;
          const element2 = document.getElementById(`pagoJornada${id}`) as HTMLInputElement;
          if (element2 !== null) {
            element2.value = jornval.toString();
          }
          
          console.log(ob)
          return {
            ...empleado,
            pagoJornada: jornval,
            diasTrabajados: {
              ...diasTrabajados,
              [name]: Object.assign({}, diaSeleccionado, { obra: value })
            },
            
          };
        } else {
          return empleado;
        }
      });
    });
  
    // Update the `ob` state variable
    setOb(prevOb => {
      let obraIndex = prevOb.findIndex(ob => ob.obra === value);
      if (obraIndex === -1) {
        // if the obra doesn't exist, add a new object to the `ob` array
        return [...prevOb, { obra: value, pago: 0 }];
      } else {
        return prevOb;
      }
    });
    
  };
  

  
  
  
  const handleDiasChange = (
    e: { target: { name: any; value: any } },
    id: any
  ) => {
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
const enviarDatos = async (e: any) => {
    console.log(ob);
   const updatedEmpleados = empleados.map(({__v, _id, ...rest }) => ({
  ...rest,
  date: new Date()
}));
const updatedObra = ob.map(({...rest }) => ({
  ...rest,
  fecha: new Date()
}));

updatedEmpleados.map( async  (e) =>{
console.log(e)
  const response = await axios.post(`${process.env.IP}/api/v1/recibo/persona`,e)
  console.log(response)
})
updatedObra.map(async(obra) => {
  console.log(obra)
  const response = await axios.post(`${process.env.IP}/api/v1/recibo/obra`,obra)
})
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
          <div className="d-flex justify-content-center py-3">
          <Button onClick={enviarDatos}>Crear Recibo</Button>
      </div>
           
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
  isClearable={true}
  onChange={(opcion: any) =>
    handleChange(
      {
        target: {
          name: 'lunes',
          value: opcion ? opcion.value : null,
        },
      },
      empleados._id,
      true // pass isClearable as a parameter
    )
  }
/>


                    </td>
                    <td>
                      <Select
  options={opciones}
  isClearable={true}
  onChange={(opcion:any) =>
    handleChange(
      {
        target: {
          name: 'martes',
         value: opcion ? opcion.value : null,
        },
      },
      empleados._id,
      true // pass isClearable as a parameter
    )
  }
/>


                    </td>
                    <td>
                     <Select
  options={opciones}
  isClearable={true}
  onChange={(opcion:any) =>
    handleChange(
      {
        target: {
          name: 'miercoles',
         value: opcion ? opcion.value : null,
        },
      },
      empleados._id,
      true // pass isClearable as a parameter
    )
  }
/>


                    </td>
                    <td>
                    <Select
  options={opciones}
  isClearable={true}
  onChange={(opcion:any) =>
    handleChange(
      {
        target: {
          name: 'jueves',
         value: opcion ? opcion.value : null,
        },
      },
      empleados._id,
      true // pass isClearable as a parameter
    )
  }
/>



                    </td>
                    <td>
                   <Select
  options={opciones}
  isClearable={true}
  onChange={(opcion:any) =>
    handleChange(
      {
        target: {
          name: 'viernes',
          value: opcion ? opcion.value : null,
        },
      },
      empleados._id,
      true // pass isClearable as a parameter
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
            <div className="text-center my-3"></div>
          </div>
        </Tab>
        <Tab eventKey="Recibo" title="Calendario Recibos">
          <Calendar  />
        </Tab>
        <Tab eventKey="Agregar Base" title="Base">
          <div className="text-center my-4">
            <Button onClick={() => setactiveEntrega(true)} className="mx-3">
              Agregar Persona Entrega
            </Button>
            <Button
              onClick={() => setactivemodalEmpleado(true)}
              className="mx-3"
            >
              Agregar Empleado
            </Button>
            <Button onClick={() => setactiveobra(true)} className="mx-3">
              Agregar Obra
            </Button>
          </div>

          <div className="my-4">
            <EntregaTable />
          </div>

          <div className="my-4">
            <VerEmpleados />
          </div>
          <div className={'my-4'}>
            <VerObras />
          </div>
        </Tab>
      </Tabs>
      <MD
        show={activeEntrega}
        onHide={() => setactiveEntrega(false)}
        body={<CreateEntregaForm />}
        title="Agregar Persona Entrega"
      />
      <MD
        show={activemodalEmpleado}
        onHide={() => setactivemodalEmpleado(false)}
        body={<CrearEmpleado />}
        title="Agregar Empleado"
      />
      <MD
        show={activeobra}
        onHide={() => setactiveobra(false)}
        body={<Obra />}
        title="Agregar Obra"
      />
    </>
  );
}

export default Tabla;
