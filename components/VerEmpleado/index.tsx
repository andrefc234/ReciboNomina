import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

interface Empleado {
  _id: string;
  nombre: string;
  cargo: string;
  pagoJornal: number;
  salario: number;
}

function EmpleadosTable() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [updateEmpleado, setUpdateEmpleado] = useState<Empleado>({
    _id: '',
    nombre: '',
    cargo: '',
    pagoJornal: 0,
    salario: 0,
  });

  useEffect(() => {
    fetch(`http://${process.env.IP}/api/v1/empleado`)
      .then((response) => response.json())
      .then((data: Empleado[]) => setEmpleados(data))
      .catch((error) => console.error(error));
  }, []);

  const handleDeleteEmpleado = (id: string) => {
    fetch(`http://${process.env.IP}/api/v1/empleado/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => setEmpleados((prevEmpleados) => prevEmpleados.filter((empleado) => empleado._id !== id)))
      .catch((error) => console.error(error));
  };

  const handleShowUpdateModal = (empleado: Empleado) => {
    setShowUpdateModal(true);
    setUpdateEmpleado(empleado);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setUpdateEmpleado({
      _id: '',
      nombre: '',
      cargo: '',
      pagoJornal: 0,
      salario: 0,
    });
  };

  const handleUpdateEmpleado = () => {
    fetch(`http://${process.env.IP}/api/v1/empleado/${updateEmpleado._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: updateEmpleado.nombre,
        cargo: updateEmpleado.cargo,
        pagoJornal: updateEmpleado.pagoJornal,
        salario: updateEmpleado.salario,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setEmpleados((prevEmpleados) =>
          prevEmpleados.map((empleado) => (empleado._id === updateEmpleado._id ? updateEmpleado : empleado))
        );
        handleCloseUpdateModal();
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cargo</th>
            <th>Pago por jornada</th>
            <th>Salario Mensual</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((empleado: Empleado) => (
            <tr key={empleado._id}>
              <td>{empleado.nombre}</td>
              <td>{empleado.cargo}</td>
              <td>{empleado.pagoJornal}</td>
              <td>{empleado.salario}</td>
              <td>
                <Button variant="primary" className="mr-2" onClick={() => handleShowUpdateModal(empleado)}>
                  Editar
                </Button>
                <Button variant="danger" className='mx-3' onClick={() => handleDeleteEmpleado(empleado._id)}>
              Eliminar
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>

  <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
    <Modal.Header closeButton>
      <Modal.Title>Editar empleado</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="formNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese nombre"
            value={updateEmpleado.nombre}
            onChange={(e) => setUpdateEmpleado({ ...updateEmpleado, nombre: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="formCargo">
          <Form.Label>Cargo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese cargo"
            value={updateEmpleado.cargo}
            onChange={(e) => setUpdateEmpleado({ ...updateEmpleado, cargo: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="formPagoJornada">
          <Form.Label>Pago por Jornal</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingrese pago por jornal"
            value={updateEmpleado.pagoJornal}
            onChange={(e) => setUpdateEmpleado({ ...updateEmpleado, pagoJornal: Number(e.target.value) })}
          />
        </Form.Group>

        <Form.Group controlId="formSueldoMensual">
          <Form.Label>Salario </Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingrese salario "
            value={updateEmpleado.salario}
            onChange={(e) => setUpdateEmpleado({ ...updateEmpleado, salario: Number(e.target.value) })}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseUpdateModal}>
        Cerrar
      </Button>
      <Button variant="primary" onClick={handleUpdateEmpleado}>
        Guardar cambios
      </Button>
    </Modal.Footer>
  </Modal>
</>
);
}

export default EmpleadosTable;
